import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import { camelizeTopKeys, clientHeader } from '../util';
import { FunctionArgs, FunctionResponse, FunctionOptions } from '../functions';

export default function invoke(
  site: string,
  name: string,
  args: FunctionArgs,
  opts: FunctionOptions = {}
): Promise<FunctionResponse> {
  let endpoint = opts.endpoint || 'https://api.statickit.com';
  let fetchImpl = opts.fetchImpl || fetchPonyfill({ Promise }).fetch;
  let url = `${endpoint}/j/sites/${site}/functions/${name}/invoke`;

  let headers: { [key: string]: string } = {
    'StaticKit-Client': clientHeader(opts.clientName),
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
      (body: FunctionResponse): FunctionResponse => {
        return camelizeTopKeys(body) as FunctionResponse;
      }
    );
  });
}
