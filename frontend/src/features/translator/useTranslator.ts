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
import {
  GoogleTranslate,
  type TranslationModel,
} from '../../services/translation/googleTranslate';
import { estimateTranslation } from '../../services/translation/batches';
import {
  safeError,
  type Language,
  type TranslationProvider,
} from '../../services/translation/provider';
import { runJob } from './job';

export type JobStatus =
  'idle' | 'running' | 'completed' | 'cancelled' | 'failed';

export function useTranslator(model: TranslationModel = 'nmt') {
  const [cues, setCues] = useState<Cue[]>([]);
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('');
  const [profile, setProfile] = useState<Profile>();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [serviceStatus, setServiceStatus] = useState<
    'empty' | 'testing' | 'ready'
  >('empty');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [edited, setEdited] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<JobStatus>('idle');
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [cueErrors, setCueErrors] = useState<Record<string, string>>({});
  const [serviceError, setServiceError] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [startedAt, setStartedAt] = useState<number>();
  const [finishedAt, setFinishedAt] = useState<number>();
  const [apiCalls, setApiCalls] = useState(0);
  const [retryAt, setRetryAt] = useState<number>();
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
      provider.current = null;
      invalidateFileReads();
    };
  }, [invalidateFileReads]);

  const invalidateService = useCallback(() => {
    testAbort.current?.abort();
    jobAbort.current?.abort();
    provider.current = null;
    setServiceStatus('empty');
  }, []);

  const loadLanguages = useCallback(async () => {
    testAbort.current?.abort();
    const controller = new AbortController();
    testAbort.current = controller;
    const candidate = new GoogleTranslate(model);
    provider.current = candidate;
    setServiceStatus('testing');
    setServiceError('');
    setLanguages([]);
    try {
      const supported = await candidate.getLanguages(controller.signal);
      if (!mounted.current || controller.signal.aborted) return;
      const targets = supported.filter((item) => item.code !== 'en');
      if (!targets.length)
        throw new Error('The gateway returned no target languages.');
      setLanguages(targets);
      setServiceStatus('ready');
    } catch (failure) {
      if (!mounted.current || controller.signal.aborted) return;
      setServiceStatus('empty');
      setServiceError(safeError(failure));
    }
  }, [model]);

  useEffect(() => {
    let disposed = false;
    queueMicrotask(() => {
      if (!disposed) void loadLanguages();
    });
    return () => {
      disposed = true;
      testAbort.current?.abort();
    };
  }, [loadLanguages]);

  const resetOutput = () => {
    setTranslations({});
    setCueErrors({});
    setEdited({});
    setStatus('idle');
    setActiveIds([]);
    setStartedAt(undefined);
    setFinishedAt(undefined);
    setApiCalls(0);
    setRetryAt(undefined);
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
      return {
        value: estimateTranslation(cues, language, model),
        error: '',
      };
    } catch (failure) {
      return {
        value: null,
        error:
          failure instanceof Error
            ? failure.message
            : 'Unable to estimate this file.',
      };
    }
  }, [cues, language, model]);
  const remainingEstimate = useMemo(() => {
    try {
      return {
        value: estimateTranslation(cues, language, model, translations),
        error: '',
      };
    } catch (failure) {
      return {
        value: null,
        error:
          failure instanceof Error
            ? failure.message
            : 'Unable to estimate remaining subtitle text.',
      };
    }
  }, [cues, language, model, translations]);
  const busy = status === 'running';
  const canStart =
    !busy &&
    !loadingFile &&
    serviceStatus === 'ready' &&
    !!profile &&
    languages.some((item) => item.code === language) &&
    pending.length > 0 &&
    !!remainingEstimate.value;

  async function start() {
    const service = provider.current;
    if (
      !canStart ||
      !service ||
      !remainingEstimate.value ||
      jobInFlight.current
    )
      return;
    jobInFlight.current = true;
    const controller = new AbortController();
    jobAbort.current = controller;
    const current = () => mounted.current && jobAbort.current === controller;
    setStatus('running');
    setError('');
    setStartedAt((previous) => previous ?? Date.now());
    setFinishedAt(undefined);
    setCueErrors({});
    try {
      await runJob(
        service,
        remainingEstimate.value.batches,
        language,
        controller.signal,
        {
          active: (ids) => {
            if (current()) setActiveIds(ids);
          },
          completed: (results) => {
            if (current() && !controller.signal.aborted) {
              setTranslations((previous) => ({
                ...previous,
                ...Object.fromEntries(
                  Object.entries(results).filter(
                    ([id]) => previous[id] === undefined,
                  ),
                ),
              }));
              setCueErrors((previous) => {
                const next = { ...previous };
                Object.keys(results).forEach((id) => delete next[id]);
                return next;
              });
            }
          },
          failed: (ids, failure) => {
            if (current())
              setCueErrors((previous) => ({
                ...previous,
                ...Object.fromEntries(
                  ids.map((id) => [id, safeError(failure)]),
                ),
              }));
          },
          request: () => {
            if (current()) {
              setRetryAt(undefined);
              setApiCalls((count) => count + 1);
            }
          },
          retryDelay: (delayMs) => {
            if (current()) setRetryAt(Date.now() + delayMs);
          },
        },
        profile,
      );
      if (current()) {
        setStatus('completed');
      }
    } catch {
      if (current()) {
        setStatus(controller.signal.aborted ? 'cancelled' : 'failed');
        // Failed batch errors are attached to only the affected cue rows.
      }
    } finally {
      jobInFlight.current = false;
      if (current()) {
        setFinishedAt(Date.now());
        setActiveIds([]);
        setRetryAt(undefined);
      }
    }
  }

  const saveEdit = useCallback((id: string, value: string) => {
    validateOutput(value);
    setTranslations((previous) => ({ ...previous, [id]: value }));
    setEdited((previous) => ({ ...previous, [id]: true }));
  }, []);
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
    serviceStatus,
    loadLanguages,
    serviceError,
    cueErrors,
    invalidateService,
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
    retryAt,
    loadFile,
    estimate,
    remainingEstimate,
    canStart,
    start,
    cancel: () => jobAbort.current?.abort(),
    saveEdit,
    restart,
    complete,
    download,
  };
}
