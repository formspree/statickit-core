import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import { version } from '../../package.json';

export interface Options {
  site: string;
  endpoint?: string;
  clientName?: string;
  fetchImpl?: typeof fetch;
}

export type Result = {
  body: object;
  response: Response;
};

const clientHeader = ({ clientName }: Options) => {
  const label = `@statickit/core@${version}`;
  if (!clientName) return label;
  return `${clientName} ${label}`;
};

export default function invoke(name: string, args: object, options: Options) {
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
      (body: object): Result => {
        return { body, response };
      }
    );
  });
}
