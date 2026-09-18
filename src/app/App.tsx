import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Flex,
  Layout,
  Modal,
  Popover,
  Progress,
  Select,
  Switch,
  Tag,
  theme,
  Tooltip,
} from 'antd';
import {
  ArrowDownOutlined,
  DownloadOutlined,
  GithubOutlined,
  MoonOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  SunOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTranslator } from '../features/translator/useTranslator';
import { continuationGroups, type Profile } from '../core/subtitles/subtitles';
import { PRICE_DATE } from '../services/translation/batches';
import type { TranslationModel } from '../services/translation/googleTranslate';
import { VirtualCueList } from '../features/translator/VirtualCueList';

const { Content, Header, Sider } = Layout;

function Elapsed({
  startedAt,
  finishedAt,
}: {
  startedAt?: number;
  finishedAt?: number;
}) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (startedAt === undefined || finishedAt !== undefined) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [startedAt, finishedAt]);
  const seconds =
    startedAt === undefined
      ? 0
      : Math.max(0, Math.floor(((finishedAt ?? now) - startedAt) / 1000));
  return (
    <span>
      {[Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
        .map((part) => String(part).padStart(2, '0'))
        .join(':')}
    </span>
  );
}

function Translator({
  dark,
  setDark,
}: {
  dark: boolean;
  setDark: (value: boolean) => void;
}) {
  const [engine, setEngine] = useState<TranslationModel>('nmt');
  const app = useTranslator(engine);
  const { token } = theme.useToken();
  const fileInput = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [follow, setFollow] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const groups = useMemo(() => continuationGroups(app.cues), [app.cues]);
  const activeIds = useMemo(() => new Set(app.activeIds), [app.activeIds]);
  const translatedCount = Object.keys(app.translations).length;
  const configuredLock = app.busy || translatedCount > 0;
  const activeId = app.activeIds[0];
  useEffect(() => {
    if (!app.busy) return;
    const preventClose = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', preventClose);
    return () => window.removeEventListener('beforeunload', preventClose);
  }, [app.busy]);

  const styles = {
    '--page': token.colorBgLayout,
    '--surface': token.colorBgContainer,
    '--text': token.colorText,
    '--muted': token.colorTextSecondary,
    '--border': token.colorBorderSecondary,
    '--accent': token.colorPrimary,
    '--hover': token.colorPrimaryBg,
    '--edit': token.colorWarningBg,
    '--edit-border': token.colorWarningBorder,
    '--gap': `${token.marginXS}px`,
    '--group-gap': `${token.marginLG}px`,
  } as CSSProperties;

  return (
    <Layout className="app" style={styles}>
      <Header className="app-header">
        <a className="brand" href="#main">
          <span className="brand-symbol" aria-hidden="true">
            S
          </span>
          <span>SRT Translator</span>
        </a>
        <Flex className="header-actions" align="center" gap="middle">
          <Tooltip
            title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <Switch
              size="small"
              checked={dark}
              onChange={setDark}
              aria-label="Dark theme"
              checkedChildren={<MoonOutlined aria-hidden="true" />}
              unCheckedChildren={<SunOutlined aria-hidden="true" />}
            />
          </Tooltip>
          <Button
            type="text"
            size="small"
            shape="circle"
            icon={<QuestionCircleOutlined aria-hidden="true" />}
            aria-label="About this translator"
            onClick={() => setAboutOpen(true)}
          />
          <Button
            size="small"
            icon={<GithubOutlined aria-hidden="true" />}
            href="https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            GitHub
          </Button>
        </Flex>
      </Header>
      <Modal
        title="What this translator does"
        open={aboutOpen}
        onCancel={() => setAboutOpen(false)}
        footer={
          <Button type="primary" onClick={() => setAboutOpen(false)}>
            OK
          </Button>
        }
      >
        <p>
          Upload an English UTF-8 SRT file, choose a translation engine, target
          language, and reading profile, then start translation.
        </p>
        <p>
          The app preserves cue order and timecodes, lets you review or edit
          each translation, and downloads a new SRT when every cue is ready.
        </p>
        <p>
          Translation sends subtitle text to this project's Google Translation
          gateway. Keep this tab open and in the foreground while a job runs.
        </p>
      </Modal>
      <Layout className="workspace">
        <Sider
          className="sidebar"
          width={320}
          theme={dark ? 'dark' : 'light'}
          aria-label="Translation controls"
        >
          <Flex vertical className="sidebar-controls" gap={20}>
            <h1 className="file-picker-heading">
              Select your English subtitle
            </h1>
            <label
              className={`file-picker ${dragging ? 'dragging' : ''} ${app.busy ? 'disabled' : ''}`}
              onDragOver={(event) => {
                event.preventDefault();
                if (!app.busy) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                const file = event.dataTransfer.files[0];
                if (file && !app.busy) void app.loadFile(file);
              }}
            >
              <UploadOutlined className="upload-icon" />
              <strong>
                {app.loadingFile
                  ? 'Reading subtitle…'
                  : app.filename || 'Choose or drop an SRT'}
              </strong>
              <span>UTF-8 · up to 5 MiB</span>
              <input
                ref={fileInput}
                type="file"
                accept=".srt"
                aria-label="Subtitle file"
                disabled={app.busy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void app.loadFile(file);
                  event.target.value = '';
                }}
              />
            </label>
            {app.cues.length > 0 && (
              <p className="file-summary">
                {app.cues.length.toLocaleString()} cues loaded · stays on this
                device
              </p>
            )}
            <Flex vertical className="field" gap={7}>
              <label htmlFor="engine">Translation engine</label>
              <Select
                id="engine"
                value={engine}
                disabled={app.busy}
                onChange={(value) => {
                  app.invalidateCredential();
                  setEngine(value as TranslationModel);
                }}
                options={[
                  {
                    value: 'nmt',
                    label: 'NMT · fast general translation',
                  },
                  {
                    value: 'tllm',
                    label: 'TLLM · higher-quality translation model',
                  },
                ]}
              />
              <p className="help-text">
                {engine === 'tllm'
                  ? "TLLM is Google's higher-quality model. This release still sends each cue separately, so it does not yet provide connected-dialogue context."
                  : 'NMT is the faster model. This release sends each cue separately for reliable timing and result mapping.'}
              </p>
            </Flex>
            <section
              className="credential-panel"
              aria-label="Translation service"
            >
              <Flex className="credential-actions" gap={8}>
                <Button
                  onClick={() => void app.testService()}
                  disabled={app.busy || app.credentialStatus === 'testing'}
                  loading={app.credentialStatus === 'testing'}
                >
                  Check service
                </Button>
                <Popover
                  title="Check service"
                  trigger={['hover', 'click']}
                  content={
                    <span className="service-help-text">
                      Sends “Hello.” to this project's Google Translation
                      service to verify it is available. Google may count those
                      characters as usage.
                    </span>
                  }
                >
                  <Button
                    type="text"
                    size="small"
                    shape="circle"
                    icon={<QuestionCircleOutlined aria-hidden="true" />}
                    aria-label="About the service check"
                  />
                </Popover>
              </Flex>
              <p className="credential-status" role="status">
                {app.credentialStatus === 'ready'
                  ? 'Translation service ready'
                  : app.credentialStatus === 'testing'
                    ? 'Checking translation service…'
                    : 'Check the service to enable translation.'}
              </p>
            </section>
            <Flex vertical className="field" gap={7}>
              <label htmlFor="language">Translate to</label>
              <Select
                id="language"
                showSearch={{ optionFilterProp: 'label' }}
                placeholder="Check the service to load languages"
                value={app.language || undefined}
                disabled={configuredLock || !app.languages.length}
                onChange={app.setLanguage}
                options={app.languages.map((item) => ({
                  value: item.code,
                  label: `${item.name} (${item.code})`,
                }))}
              />
            </Flex>
            <Flex vertical className="field" gap={7}>
              <label htmlFor="profile">Reading profile</label>
              <Select
                id="profile"
                value={app.profile}
                placeholder="Choose a reading profile"
                disabled={configuredLock}
                onChange={(value: Profile) => app.setProfile(value)}
                options={[
                  { value: 'adult', label: 'Adult · 20 characters/second' },
                  {
                    value: 'children',
                    label: 'Children · 17 characters/second',
                  },
                ]}
              />
            </Flex>
            {app.cues.length > 0 && app.estimate.value && (
              <Card className="estimate" size="small" title="Cost estimate">
                {engine === 'nmt' ? (
                  <>
                    <p>
                      <strong>${app.estimate.value.usd.toFixed(4)} USD</strong>{' '}
                      for all remaining subtitle text.
                    </p>
                    <ul>
                      <li>
                        {app.estimate.value.characters.toLocaleString()}{' '}
                        characters sent to Google in{' '}
                        {app.estimate.value.batches.length} requests.
                      </li>
                      <li>
                        This is the estimated total for this file, not a charge
                        per request.
                      </li>
                      <li>
                        If every request had to run three times, the maximum
                        estimate would be $
                        {app.estimate.value.retryCeilingUsd.toFixed(4)} USD.
                      </li>
                    </ul>
                  </>
                ) : (
                  <p>
                    TLLM charges for both input and output characters. This app
                    cannot give a reliable TLLM total yet, so check Google's
                    pricing before starting.
                  </p>
                )}
                <small>
                  Remaining credits are unknown. Service checks and manual
                  retries may add usage. NMT price checked {PRICE_DATE}.{' '}
                  <a
                    href="https://cloud.google.com/products/translate/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google pricing ↗
                  </a>
                </small>
              </Card>
            )}
            {app.estimate.error && (
              <Alert type="error" title={app.estimate.error} showIcon />
            )}
          </Flex>
          <Flex
            vertical
            className={`sidebar-actions ${app.cues.length ? 'is-loaded' : ''}`}
            gap={10}
          >
            <Button
              type="primary"
              size="large"
              block
              icon={<PlayCircleOutlined aria-hidden="true" />}
              disabled={!app.canStart}
              onClick={() => {
                setFollow(true);
                void app.start();
              }}
            >
              {translatedCount
                ? 'Translate remaining cues'
                : 'Start translation'}
            </Button>
            {app.busy && (
              <Button danger block onClick={app.cancel}>
                Cancel translation
              </Button>
            )}
            {app.cues.length > 0 && (
              <div className="job-summary" aria-live="polite">
                <div>
                  <strong>
                    {translatedCount} / {app.cues.length} cues complete
                  </strong>
                  <Tag>{app.status}</Tag>
                </div>
                <Progress
                  percent={Math.round(
                    (translatedCount / app.cues.length) * 100,
                  )}
                  status={
                    app.status === 'failed'
                      ? 'exception'
                      : app.busy
                        ? 'active'
                        : 'normal'
                  }
                />
                <dl>
                  <div>
                    <dt>Elapsed</dt>
                    <dd>
                      <Elapsed
                        startedAt={app.startedAt}
                        finishedAt={app.finishedAt}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt>Google requests</dt>
                    <dd>{app.apiCalls}</dd>
                  </div>
                </dl>
                {app.startedAt !== undefined && (
                  <small>
                    Started {new Date(app.startedAt).toLocaleTimeString()}
                    {app.finishedAt !== undefined && (
                      <>
                        {' '}
                        · Finished{' '}
                        {new Date(app.finishedAt).toLocaleTimeString()}
                      </>
                    )}
                  </small>
                )}
              </div>
            )}
            <Button
              block
              icon={<DownloadOutlined aria-hidden="true" />}
              disabled={!app.complete || app.busy}
              onClick={app.download}
            >
              Download translated SRT
            </Button>
            {translatedCount > 0 && (
              <Button block disabled={app.busy} onClick={app.restart}>
                Reset translations / change settings
              </Button>
            )}
          </Flex>
        </Sider>
        <Content
          id="main"
          className="content"
          ref={viewport}
          tabIndex={-1}
          onWheel={() => setFollow(false)}
          onTouchMove={() => setFollow(false)}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setFollow(false);
          }}
          onKeyDown={(event) => {
            if (
              [
                'PageUp',
                'PageDown',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
              ].includes(event.key)
            )
              setFollow(false);
          }}
        >
          <header className="content-heading">
            <h2>Subtitle preview</h2>
            {app.cues.length > 0 && (
              <div className="column-headings">
                <span>ORIGINAL · ENGLISH</span>
                <span>
                  TRANSLATION
                  {app.language
                    ? ` · ${app.languages.find((item) => item.code === app.language)?.name ?? app.language}`
                    : ''}
                </span>
              </div>
            )}
          </header>
          {app.error && (
            <Alert className="banner" type="error" title={app.error} showIcon />
          )}
          {app.busy && (
            <Alert
              className="banner"
              type="warning"
              title="Keep this tab open and in the foreground"
              description="Backgrounding the tab, sleeping your device, or closing the page can pause or stop translation. Reloading loses this session’s work."
              showIcon
            />
          )}
          {(app.status === 'failed' || app.status === 'cancelled') && (
            <Alert
              className="banner"
              type="info"
              title="Completed cues and saved edits are kept in this tab."
              description="Translate remaining cues resumes unfinished work. Reload recovery is not available yet."
              showIcon
            />
          )}
          {app.cues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-symbol" aria-hidden="true">
                Aa
              </div>
              <h3>Bring your subtitles.</h3>
              <p>
                Load an English SRT to preview every cue.
                <br />
                Timing stays intact, and you can edit the translation.
              </p>
              <Button
                icon={<UploadOutlined aria-hidden="true" />}
                onClick={() => fileInput.current?.click()}
              >
                Choose subtitle file
              </Button>
              <p className="empty-note">
                Supported formatting: italic, bold, underline.
              </p>
            </div>
          ) : (
            <>
              <VirtualCueList
                cues={app.cues}
                translations={app.translations}
                edited={app.edited}
                activeIds={activeIds}
                failed={app.status === 'failed' || app.status === 'cancelled'}
                profile={app.profile}
                groups={groups}
                activeId={activeId}
                follow={follow}
                scrollElement={viewport}
                onSave={app.saveEdit}
              />
            </>
          )}
        </Content>
      </Layout>
      {!follow && app.busy && (
        <Button
          className="follow-button"
          type="primary"
          icon={<ArrowDownOutlined aria-hidden="true" />}
          onClick={() => setFollow(true)}
        >
          Scroll to current block
        </Button>
      )}
    </Layout>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <ConfigProvider
      theme={{
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#42664d',
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <Translator dark={dark} setDark={setDark} />
    </ConfigProvider>
  );
}
