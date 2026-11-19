export interface Language {
  code: string;
  name: string;
}
export interface TranslationInput {
  id: string;
  text: string;
}
export interface TranslationResult {
  id: string;
  text: string;
}
export interface TranslationProvider {
  getLanguages(signal: AbortSignal): Promise<Language[]>;
  translateBatch(
    inputs: TranslationInput[],
    target: string,
    signal: AbortSignal,
    onRequest?: () => void,
    onRetryDelay?: (delayMs: number) => void,
  ): Promise<TranslationResult[]>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly retryable = false,
    readonly retryDelayMs?: number,
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

export function aborted(): DOMException {
  return new DOMException('Cancelled.', 'AbortError');
}
export function checkAbort(signal: AbortSignal): void {
  if (signal.aborted) throw aborted();
}
export function safeError(error: unknown): string {
  return error instanceof ProviderError
    ? error.message
    : 'The operation could not be completed. Please try again.';
}
