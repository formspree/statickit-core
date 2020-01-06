export type ArgsErrors = {
  /** A flag indicating the function call failed. */
  ok: false;

  /** The reason the function call failed. */
  reason: 'argsErrors';

  /** An array of specific validation errors. */
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
};

export type ConfigErrors = {
  /** A flag indicating the function call failed. */
  ok: false;

  /** The reason the function call failed. */
  reason: 'configErrors';

  /** An array of specific validation errors. */
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
};

export type RuntimeError = {
  /** A flag indicating the function call failed. */
  ok: false;

  /** The reason the function call failed. */
  reason: 'runtimeError';

  /** Details about the runtime error. */
  error: {
    message: string;
  };
};

export namespace SendNotification {
  export type Args = {
    /** The email subject line. */
    subject: string;

    /** The Reply-To email address. */
    replyTo?: string;

    /** An object containing fields. */
    fields?: object;
  };

  export type Success = {
    /** A flag indicating the function call failed. */
    ok: true;
  };
}
