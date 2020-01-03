import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import { version } from '../../package.json';

export interface Options {
  site: string;
  endpoint?: string;
  clientName?: string;
  fetchImpl?: typeof fetch;
}

type Success = {
  ok: true;
  body: object;
  response: Response;
};

type ValidationError = {
  ok: false;
  reason: 'args' | 'config';
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
};

type RuntimeError = {
  ok: false;
  reason: 'runtime';
  error: {
    message: string;
  };
};

export type Result = Success | ValidationError | RuntimeError;

const clientHeader = ({ clientName }: Options) => {
  const label = `@statickit/core@${version}`;
  if (!clientName) return label;
  return `${clientName} ${label}`;
};

export default function invoke(
  name: string,
  args: object,
  options: Options
): Promise<Result> {
  let endpoint = options.endpoint || 'https://api.statickit.com';
  let fetchImpl = options.fetchImpl || fetchPonyfill({ Promise }).fetch;
  let site = options.site;
  let url = `${endpoint}/j/sites/${site}/functions/${name}/invoke`;

  let headers: { [key: string]: string } = {
    'StaticKit-Client': clientHeader(options),
    'Content-Type': 'application/json'
  };

  let request = {
    method: 'POST',
    mode: 'cors' as const,
    body: JSON.stringify({ args }),
    headers
  };

  return fetchImpl(url, request).then(response => {
    return response.json().then(
      (body: Result): Result => {
        return body;
      }
    );
  });
}
