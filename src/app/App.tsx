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
  Progress,
  Select,
  Switch,
  Tag,
  theme,
  Tooltip,
  Upload,
  type UploadRef,
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

import { appTheme, spacing } from './theme';

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
  onReset,
}: {
  dark: boolean;
  setDark: (value: boolean) => void;
  onReset: () => void;
}) {
  const [engine, setEngine] = useState<TranslationModel>('nmt');
  const app = useTranslator(engine);
  const { token } = theme.useToken();
  const uploadRef = useRef<UploadRef>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [follow, setFollow] = useState(true);
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
    '--group-gap': `${spacing.large}px`,
    '--space-small': `${spacing.small}px`,
    '--space-medium': `${spacing.medium}px`,
    '--space-large': `${spacing.large}px`,
    '--space-bottom': `${spacing.bottom}px`,
    '--on-accent': token.colorTextLightSolid,
  } as CSSProperties;

  return (
    <Layout className="app" style={styles}>
      <Header className="app-header">
        <Button
          type="text"
          className="brand"
          aria-label="Reset translator and return home"
          onClick={() => {
            if (
              (app.cues.length || app.busy) &&
              !window.confirm(
                'Reset the workspace and discard this session’s subtitles and edits?',
              )
            )
              return;
            onReset();
          }}
        >
          <span className="brand-symbol" aria-hidden="true">
            S
          </span>
          <span>SRT Translator</span>
        </Button>
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
          width="20%"
          theme={dark ? 'dark' : 'light'}
          aria-label="Translation controls"
        >
          <Flex vertical className="sidebar-controls" gap={spacing.large}>
            <h1 className="file-picker-heading">
              Select your English subtitle
            </h1>
            <Upload.Dragger
              ref={uploadRef}
              accept=".srt"
              multiple={false}
              maxCount={1}
              showUploadList={false}
              disabled={app.busy || app.loadingFile}
              beforeUpload={(file) => {
                void app.loadFile(file);
                return false;
              }}
              aria-label="Subtitle file"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                {app.loadingFile
                  ? 'Reading subtitle…'
                  : app.filename || 'Choose or drop an SRT'}
              </p>
              <p className="ant-upload-hint">UTF-8 · up to 5 MiB</p>
            </Upload.Dragger>
            {app.cues.length > 0 && (
              <p className="file-summary">
                {app.cues.length.toLocaleString()} cues loaded · stays on this
                device
              </p>
            )}
            <Flex vertical className="field" gap={spacing.small}>
              <label htmlFor="engine">Translation engine</label>
              <Select
                id="engine"
                value={engine}
                disabled={configuredLock}
                onChange={(value) => {
                  app.invalidateService();
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
                  ? "TLLM is Google's higher-quality translation model. Connected speech is joined before translation; quality varies by language."
                  : 'NMT offers fast general translation. Connected speech is joined before translation.'}
              </p>
            </Flex>
            {app.serviceError && (
              <Alert
                type="error"
                title="Could not load languages"
                description={app.serviceError}
                action={
                  <Button
                    disabled={app.busy}
                    onClick={() => void app.loadLanguages()}
                  >
                    Retry loading languages
                  </Button>
                }
                showIcon
              />
            )}
            <Flex vertical className="field" gap={spacing.small}>
              <label htmlFor="language">Translate to</label>
              <Select
                id="language"
                showSearch={{ optionFilterProp: 'label' }}
                placeholder={
                  app.serviceStatus === 'testing'
                    ? 'Loading languages…'
                    : 'Choose a language'
                }
                loading={app.serviceStatus === 'testing'}
                value={app.language || undefined}
                disabled={configuredLock || !app.languages.length}
                onChange={app.setLanguage}
                options={app.languages.map((item) => ({
                  value: item.code,
                  label: `${item.name} (${item.code})`,
                }))}
              />
            </Flex>
            <Flex vertical className="field" gap={spacing.small}>
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
                <p>
                  <strong>${app.estimate.value.usd.toFixed(4)} USD</strong>{' '}
                  estimated for this whole file with the selected engine.
                </p>
                <p>
                  {app.estimate.value.characters.toLocaleString()} input
                  characters · {app.estimate.value.batches.length} requests.
                </p>
                {translatedCount > 0 && app.remainingEstimate.value && (
                  <p>
                    <strong>
                      ${app.remainingEstimate.value.usd.toFixed(4)} USD
                    </strong>{' '}
                    estimated for the remaining text.
                  </p>
                )}
                {engine === 'tllm' && (
                  <p>
                    Assumes{' '}
                    {app.estimate.value.outputCharactersAssumed.toLocaleString()}{' '}
                    output characters, equal to the input length. Actual output
                    length changes the price.
                  </p>
                )}
                <small>
                  Estimated total, not the final bill. The project owner pays;
                  credits and discounts are unknown. Retries add usage.{' '}
                  {engine === 'nmt'
                    ? '$20 per million input characters.'
                    : '$10 per million input plus $10 per million output characters.'}{' '}
                  Prices checked {PRICE_DATE}.{' '}
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
            {app.remainingEstimate.error && (
              <Alert
                type="error"
                title={app.remainingEstimate.error}
                showIcon
              />
            )}
          </Flex>
          <Flex
            vertical
            className={`sidebar-actions ${app.cues.length ? 'is-loaded' : ''}`}
            gap={spacing.small}
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
              {app.status === 'failed'
                ? 'Retry translation'
                : app.complete
                  ? 'Translation complete'
                  : translatedCount
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
                  <Tag>
                    {app.status === 'running'
                      ? 'translating'
                      : app.status === 'completed'
                        ? 'done'
                        : app.status}
                  </Tag>
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
                Reset translations
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
              description="Retry resumes unfinished work and keeps the request count. Reload recovery is not available yet."
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
                onClick={() =>
                  uploadRef.current?.nativeElement
                    ?.querySelector('input')
                    ?.click()
                }
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
                cueErrors={app.cueErrors}
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
  const [dark, setDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const [workspace, setWorkspace] = useState(0);
  return (
    <ConfigProvider theme={appTheme(dark)}>
      <Translator
        key={workspace}
        dark={dark}
        setDark={setDark}
        onReset={() => setWorkspace((value) => value + 1)}
      />
    </ConfigProvider>
  );
}
