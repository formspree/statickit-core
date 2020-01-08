export interface FunctionArgs {
  [key: string]: any;
}

export interface FunctionOptions {
  endpoint?: string;
  clientName?: string;
  fetchImpl?: typeof fetch;
}

export interface FunctionSuccess {
  status: 'ok';
}

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
export type FunctionResponse = FunctionSuccess | Failure;
