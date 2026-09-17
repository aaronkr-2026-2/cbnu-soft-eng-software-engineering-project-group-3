import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MAX_FILE_BYTES,
  outputFilename,
  parseSrt,
  serializeSrt,
  validateOutput,
  type Cue,
} from '../../core/srt/srt';
import type { Profile } from '../../core/subtitles/subtitles';
import { GoogleTranslate } from '../../services/translation/googleTranslate';
import { estimateTranslation } from '../../services/translation/batches';
import {
  safeError,
  type Language,
  type TranslationProvider,
} from '../../services/translation/provider';
import { runJob } from './job';

export type JobStatus =
  'idle' | 'running' | 'completed' | 'cancelled' | 'failed';

export function useTranslator() {
  const [cues, setCues] = useState<Cue[]>([]);
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('');
  const [profile, setProfile] = useState<Profile>();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [credentialStatus, setCredentialStatus] = useState<
    'empty' | 'testing' | 'ready'
  >('empty');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [edited, setEdited] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<JobStatus>('idle');
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [startedAt, setStartedAt] = useState<number>();
  const [finishedAt, setFinishedAt] = useState<number>();
  const [apiCalls, setApiCalls] = useState(0);
  const provider = useRef<TranslationProvider | null>(null);
  const testAbort = useRef<AbortController | null>(null);
  const jobAbort = useRef<AbortController | null>(null);
  const fileRevision = useRef(0);
  const jobInFlight = useRef(false);
  const mounted = useRef(true);
  const invalidateFileReads = useCallback(() => {
    fileRevision.current++;
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      testAbort.current?.abort();
      jobAbort.current?.abort();
      provider.current?.clear();
      provider.current = null;
      invalidateFileReads();
    };
  }, [invalidateFileReads]);

  const invalidateCredential = useCallback(() => {
    testAbort.current?.abort();
    jobAbort.current?.abort();
    provider.current?.clear();
    provider.current = null;
    setCredentialStatus('empty');
  }, []);

  async function testKey(key: string) {
    invalidateCredential();
    if (!key.trim()) {
      setError('Enter your Cloud Translation API key.');
      return;
    }
    setError('');
    setCredentialStatus('testing');
    const controller = new AbortController();
    testAbort.current = controller;
    const candidate = new GoogleTranslate(key);
    try {
      const supported = await candidate.getLanguages(controller.signal);
      const target =
        supported.find((item) => item.code === 'es') ??
        supported.find((item) => item.code !== 'en');
      if (!target) throw new Error('No target language');
      // A tiny translation verifies permissions as well as the language-list endpoint.
      await candidate.translateBatch(
        [{ id: 'key-test', text: 'Hello.' }],
        target.code,
        controller.signal,
      );
      if (!mounted.current || controller.signal.aborted) {
        candidate.clear();
        return;
      }
      provider.current = candidate;
      setLanguages(supported);
      setCredentialStatus('ready');
    } catch (failure) {
      candidate.clear();
      if (!mounted.current || controller.signal.aborted) return;
      setCredentialStatus('empty');
      setError(safeError(failure));
    }
  }

  const resetOutput = () => {
    setTranslations({});
    setEdited({});
    setStatus('idle');
    setActiveIds([]);
    setStartedAt(undefined);
    setFinishedAt(undefined);
    setApiCalls(0);
    setError('');
  };

  async function loadFile(file: File) {
    if (status === 'running') return;
    if (
      Object.keys(translations).length &&
      !window.confirm(
        'Replace this file and discard its translations and saved edits?',
      )
    )
      return;
    const revision = ++fileRevision.current;
    setLoadingFile(true);
    setCues([]);
    setFilename('');
    resetOutput();
    try {
      if (!/\.srt$/i.test(file.name))
        throw new Error('Choose a file with the .srt extension.');
      if (file.size > MAX_FILE_BYTES)
        throw new Error('This file exceeds the 5 MiB limit.');
      const bytes = await file.arrayBuffer();
      if (revision !== fileRevision.current || !mounted.current) return;
      let raw: string;
      try {
        raw = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      } catch {
        throw new Error('Save the subtitle as UTF-8 before importing it.');
      }
      const parsed = parseSrt(raw);
      setCues(parsed);
      setFilename(file.name);
    } catch (failure) {
      if (revision === fileRevision.current && mounted.current)
        setError(
          failure instanceof Error
            ? failure.message
            : 'Could not read this file.',
        );
    } finally {
      if (revision === fileRevision.current && mounted.current)
        setLoadingFile(false);
    }
  }

  const pending = useMemo(
    () => cues.filter((cue) => translations[cue.id] === undefined),
    [cues, translations],
  );
  const estimate = useMemo(() => {
    try {
      return { value: estimateTranslation(pending, language), error: '' };
    } catch (failure) {
      return {
        value: null,
        error:
          failure instanceof Error
            ? failure.message
            : 'Unable to estimate this file.',
      };
    }
  }, [pending, language]);
  const busy = status === 'running';
  const canStart =
    !busy &&
    !loadingFile &&
    credentialStatus === 'ready' &&
    !!profile &&
    languages.some((item) => item.code === language) &&
    pending.length > 0 &&
    !!estimate.value;

  async function start() {
    const service = provider.current;
    if (!canStart || !service || !estimate.value || jobInFlight.current) return;
    jobInFlight.current = true;
    const controller = new AbortController();
    jobAbort.current = controller;
    const current = () => mounted.current && jobAbort.current === controller;
    setStatus('running');
    setError('');
    setStartedAt(Date.now());
    setFinishedAt(undefined);
    setApiCalls(0);
    try {
      await runJob(
        service,
        estimate.value.batches,
        language,
        controller.signal,
        {
          active: (ids) => {
            if (current()) setActiveIds(ids);
          },
          completed: (results) => {
            if (current() && !controller.signal.aborted)
              setTranslations((previous) => ({ ...previous, ...results }));
          },
          request: () => {
            if (current()) setApiCalls((count) => count + 1);
          },
        },
      );
      if (current()) {
        setStatus('completed');
        service.clear();
        provider.current = null;
        setCredentialStatus('empty');
      }
    } catch (failure) {
      if (current()) {
        setStatus(controller.signal.aborted ? 'cancelled' : 'failed');
        if (!controller.signal.aborted) setError(safeError(failure));
      }
    } finally {
      jobInFlight.current = false;
      if (current()) {
        setFinishedAt(Date.now());
        setActiveIds([]);
      }
    }
  }

  function saveEdit(id: string, value: string) {
    validateOutput(value);
    setTranslations((previous) => ({ ...previous, [id]: value }));
    setEdited((previous) => ({ ...previous, [id]: true }));
  }
  function restart() {
    if (busy) return;
    if (
      Object.keys(translations).length &&
      !window.confirm(
        'Discard all translations and saved edits? New translation calls may incur charges.',
      )
    )
      return;
    resetOutput();
  }

  const complete =
    cues.length > 0 && cues.every((cue) => translations[cue.id] !== undefined);
  function download() {
    if (!complete || busy) return;
    try {
      const text = serializeSrt(cues, translations);
      const url = URL.createObjectURL(
        new Blob([text], { type: 'application/x-subrip;charset=utf-8' }),
      );
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = outputFilename(filename, language);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError('Output validation failed. Check cue text before downloading.');
    }
  }

  return {
    cues,
    filename,
    language,
    setLanguage,
    profile,
    setProfile,
    languages,
    credentialStatus,
    testKey,
    invalidateCredential,
    translations,
    edited,
    status,
    busy,
    activeIds,
    error,
    loadingFile,
    startedAt,
    finishedAt,
    apiCalls,
    loadFile,
    estimate,
    canStart,
    start,
    cancel: () => jobAbort.current?.abort(),
    saveEdit,
    restart,
    complete,
    download,
  };
}
