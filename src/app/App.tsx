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
  ConfigProvider,
  Progress,
  Select,
  Switch,
  Tag,
  theme,
} from 'antd';
import {
  ArrowDownOutlined,
  DownloadOutlined,
  GithubOutlined,
  PlayCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTranslator } from '../features/translator/useTranslator';
import { CueRow } from '../features/translator/CueRow';
import { continuationGroups, type Profile } from '../core/subtitles/subtitles';
import { PRICE_DATE } from '../services/translation/batches';

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
  const app = useTranslator();
  const { token } = theme.useToken();
  const keyInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLElement>(null);
  const [follow, setFollow] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [engine, setEngine] = useState('google-translate');
  const groups = useMemo(() => continuationGroups(app.cues), [app.cues]);
  const translatedCount = Object.keys(app.translations).length;
  const configuredLock = app.busy || translatedCount > 0;
  const activeId = app.activeIds[0];
  useEffect(() => {
    if (follow && activeId)
      document
        .getElementById(activeId)
        ?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  }, [activeId, follow]);
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

  function clearKey() {
    if (keyInput.current) keyInput.current.value = '';
    app.invalidateCredential();
  }
  function testKey() {
    const input = keyInput.current;
    if (!input) return;
    const key = input.value;
    input.value = '';
    void app.testKey(key);
  }

  return (
    <div className="app" style={styles}>
      <header className="app-header">
        <a className="brand" href="#main">
          <span className="brand-symbol" aria-hidden="true">
            S
          </span>
          <span>
            SRT Translator<small>Keep the timing. Translate the story.</small>
          </span>
        </a>
        <div className="header-actions">
          <span className="mode-label">Translator</span>
          <Switch
            checked={dark}
            onChange={setDark}
            aria-label="Dark theme"
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
          <Button
            icon={<GithubOutlined aria-hidden="true" />}
            href="https://github.com/aaronkr-2026-2/cbnu-soft-eng-software-engineering-project-group-3"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            GitHub
          </Button>
        </div>
      </header>
      <div className="workspace">
        <aside className="sidebar" aria-label="Translation controls">
          <div className="section-heading">
            <span className="eyebrow">YOUR WORKSPACE</span>
            <h1>Translate subtitles</h1>
            <p>English in. Your language out.</p>
          </div>
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
          <div className="field">
            <label htmlFor="engine">Translation engine</label>
            <Select
              id="engine"
              value={engine}
              disabled={app.busy}
              onChange={(value) => {
                clearKey();
                setEngine(value);
              }}
              options={[
                {
                  value: 'google-translate',
                  label: 'Google Translate · official API',
                },
                {
                  value: 'google-gemini',
                  label: 'Google Gemini · not available',
                  disabled: true,
                },
              ]}
            />
          </div>
          <section
            className="credential-panel"
            aria-label="Provider credential"
          >
            <label htmlFor="provider-key">Your Cloud Translation key</label>
            <input
              className="key-input"
              type="password"
              id="provider-key"
              ref={keyInput}
              autoComplete="off"
              spellCheck={false}
              disabled={app.busy}
              placeholder="Paste key for this tab"
              onChange={() => app.invalidateCredential()}
            />
            <div className="credential-actions">
              <Button
                onClick={testKey}
                disabled={app.busy || app.credentialStatus === 'testing'}
                loading={app.credentialStatus === 'testing'}
              >
                Test key
              </Button>
              <Button onClick={clearKey}>Clear key</Button>
            </div>
            <p className="credential-status" role="status">
              {app.credentialStatus === 'ready'
                ? 'Key verified · ready to translate'
                : app.credentialStatus === 'testing'
                  ? 'Checking key with Google…'
                  : 'Enter and test a key to enable translation.'}
            </p>
            <p className="help-text">
              Memory only; cleared on reload and successful completion. Browser
              extensions and developer tools can observe it. Test key translates
              “Hello.” (6 characters; retries may add usage).
            </p>
            <a
              href="https://docs.cloud.google.com/translate/docs/setup"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get a Cloud Translation key ↗
            </a>
          </section>
          <div className="field">
            <label htmlFor="language">Translate to</label>
            <Select
              id="language"
              showSearch={{ optionFilterProp: 'label' }}
              placeholder="Test your key to load languages"
              value={app.language || undefined}
              disabled={configuredLock || !app.languages.length}
              onChange={app.setLanguage}
              options={app.languages.map((item) => ({
                value: item.code,
                label: `${item.name} (${item.code})`,
              }))}
            />
          </div>
          <div className="field">
            <label htmlFor="profile">Reading profile</label>
            <Select
              id="profile"
              value={app.profile}
              placeholder="Choose a reading profile"
              disabled={configuredLock}
              onChange={(value: Profile) => app.setProfile(value)}
              options={[
                { value: 'adult', label: 'Adult · 20 characters/second' },
                { value: 'children', label: 'Children · 17 characters/second' },
              ]}
            />
          </div>
          {app.cues.length > 0 && app.estimate.value && (
            <div className="estimate">
              <strong>Before you translate</strong>
              <span>
                {app.estimate.value.characters.toLocaleString()} characters ·{' '}
                {app.estimate.value.batches.length} remaining batches
              </span>
              <span>
                Estimated list cost: ${app.estimate.value.usd.toFixed(4)} USD
              </span>
              <span>
                With automatic retries: up to $
                {app.estimate.value.retryCeilingUsd.toFixed(4)} USD per attempt
              </span>
              <small>
                Includes provider-bound markup. Remaining credits are unknown;
                manual retries/test calls add usage. NMT price checked{' '}
                {PRICE_DATE}.{' '}
                <a
                  href="https://cloud.google.com/products/translate/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pricing ↗
                </a>
              </small>
            </div>
          )}
          {app.estimate.error && (
            <Alert type="error" title={app.estimate.error} showIcon />
          )}
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
            {translatedCount ? 'Translate remaining cues' : 'Start translation'}
          </Button>
          {app.busy && (
            <Button danger block onClick={app.cancel}>
              Cancel translation
            </Button>
          )}
          <p className="help-text">
            Translation sends subtitle text to Google using your account. No
            subtitle files or usage telemetry are uploaded to this project.
          </p>
          <div className="job-summary" aria-live="polite">
            <div>
              <strong>
                {translatedCount} / {app.cues.length}
              </strong>
              <Tag>{app.status}</Tag>
            </div>
            <Progress
              percent={
                app.cues.length
                  ? Math.round((translatedCount / app.cues.length) * 100)
                  : 0
              }
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
                <dt>API calls</dt>
                <dd>{app.apiCalls}</dd>
              </div>
            </dl>
            {app.startedAt !== undefined && (
              <small>
                Started {new Date(app.startedAt).toLocaleTimeString()}
                {app.finishedAt !== undefined && (
                  <>
                    {' '}
                    · Finished {new Date(app.finishedAt).toLocaleTimeString()}
                  </>
                )}
              </small>
            )}
          </div>
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
        </aside>
        <main
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
          <div className="content-heading">
            <div>
              <span className="eyebrow">SUBTITLE PREVIEW</span>
              <h2>
                {app.filename
                  ? 'Your words, in sync.'
                  : 'A new language. The same story.'}
              </h2>
            </div>
            <Tag>
              {app.cues.length ? `${app.cues.length} cues` : 'Local files'}
            </Tag>
          </div>
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
              <div className="column-headings">
                <span>ORIGINAL · ENGLISH</span>
                <span>
                  TRANSLATION
                  {app.language
                    ? ` · ${app.languages.find((item) => item.code === app.language)?.name ?? app.language}`
                    : ''}
                </span>
              </div>
              {app.cues.map((cue, index) => (
                <CueRow
                  key={`${app.filename}:${cue.id}`}
                  cue={cue}
                  translation={app.translations[cue.id]}
                  edited={!!app.edited[cue.id]}
                  active={app.activeIds.includes(cue.id)}
                  failed={app.status === 'failed' || app.status === 'cancelled'}
                  profile={app.profile}
                  group={groups[index]}
                  groupStart={
                    index === 0 || groups[index] !== groups[index - 1]
                  }
                  onSave={app.saveEdit}
                />
              ))}
            </>
          )}
        </main>
      </div>
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
    </div>
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
