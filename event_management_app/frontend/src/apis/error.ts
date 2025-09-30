export class ResponseError extends Error {
  code?: number;
  requestId?: string;
  cause?: {
    [key: string]: boolean;
  };
  constructor(
    message: string | undefined,
    code?: number,
    requestId?: string,
    cause?: { [key: string]: boolean }
  ) {
    super(
      message ||
        'API error happened while trying to communicate with the server.'
    );
    this.code = code;
    this.requestId = requestId;
    this.cause = cause;
  }
}
