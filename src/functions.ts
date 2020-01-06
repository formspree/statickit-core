export type ArgsErrors = {
  ok: false;
  reason: 'argsErrors';
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
};

export type ConfigErrors = {
  ok: false;
  reason: 'configErrors';
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
};

export type RuntimeError = {
  ok: false;
  reason: 'runtimeError';
  error: {
    message: string;
  };
};

export type Error = ArgsErrors | ConfigErrors | RuntimeError;

export namespace SendNotification {
  export type Args = {
    subject: string;
    replyTo?: string;
    fields?: object;
  };

  export type Success = {
    ok: true;
  };

  export type Response = Success | Error;
}
