import { ResponseError } from './error';

export const handleError = (error: unknown): never => {
  if (error && typeof error === 'object') {
    const errorMessage =
      'msg' in error && typeof error.msg === 'string'
        ? error.msg
        : 'message' in error && typeof error.message === 'string'
          ? error.message
          : undefined;

    const errorCode =
      'code' in error && typeof error.code === 'number'
        ? error.code
        : undefined;
    const requestId =
      'requestId' in error && typeof error.requestId === 'string'
        ? error.requestId
        : undefined;
    const cause =
      'cause' in error &&
      typeof error.cause === 'object' &&
      error.cause !== null
        ? Object.fromEntries(
            Object.entries(error.cause as Record<string, unknown>).map(
              ([key, value]) => [key, Boolean(value)]
            )
          )
        : undefined;

    if (errorMessage) {
      throw new ResponseError(errorMessage, errorCode, requestId, cause);
    }
  }

  if (error !== null && typeof error === 'object' && 'stack' in error) {
    console.error(error.stack);
  }

  // the error doesn't have a message or msg property, so we can't throw it as an error. Log it via Sentry so that we can
  // add handling for it.
  // Sentry.captureException(error);

  // throw a generic error if we don't know what the error is. The message is intentionally vague because it might show
  // up in the UI.
  throw new ResponseError(undefined);
};
