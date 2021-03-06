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

export interface ArgumentError {
  status: 'argumentError';
  message?: string;
  errors: Array<{
    field: string;
    message: string;
    code?: string;
    properties: object;
  }>;
}

export interface ConfigError {
  status: 'configError';
  message?: string;
  errors: Array<{
    field: string;
    message: string;
    code?: string;
    properties: object;
  }>;
}

export interface RuntimeError {
  status: 'runtimeError';
  message: string;
}

export type Failure = ArgumentError | ConfigError | RuntimeError;

export type FunctionResponse = FunctionSuccess | Failure;
