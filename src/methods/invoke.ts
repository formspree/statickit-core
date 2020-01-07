import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import { camelizeTopKeys } from '../util';
import { GenericResponse, FunctionOptions } from '../functions';
import { version } from '../../package.json';

const clientHeader = ({ clientName }: FunctionOptions) => {
  const label = `@statickit/core@${version}`;
  if (!clientName) return label;
  return `${clientName} ${label}`;
};

export default function invoke(
  name: string,
  args: object,
  options: FunctionOptions
): Promise<GenericResponse> {
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
      (body: GenericResponse): GenericResponse => {
        return camelizeTopKeys(body) as GenericResponse;
      }
    );
  });
}
