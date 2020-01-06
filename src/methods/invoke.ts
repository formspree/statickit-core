import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import { camelizeTopKeys } from '../util';
import { Failure } from '../functions';
import { version } from '../../package.json';

export interface Options {
  site?: string;
  endpoint?: string;
  clientName?: string;
  fetchImpl?: typeof fetch;
}

type ResponseBody = {
  [key: string]: any;
};

type Success = ResponseBody & {
  status: 'ok';
};

export type Result = Success | Failure;

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
  if (!options.site) throw new Error('`site` is required');

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
        return camelizeTopKeys(body) as Result;
      }
    );
  });
}
