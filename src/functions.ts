export interface InvalidArgs {
  status: 'invalidArgs';
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
}

export interface InvalidConfig {
  status: 'invalidConfig';
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
}

export interface RuntimeError {
  status: 'runtimeError';
  message: string;
}

export type Failure = InvalidArgs | InvalidConfig | RuntimeError;

export namespace SendNotification {
  export interface Args {
    subject: string;
    replyTo?: string;
    fields?: object;
  }

  export interface Success {
    status: 'ok';
  }

  export type Response = Success | Failure;
}
