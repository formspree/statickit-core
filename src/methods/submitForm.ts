import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import objectAssign from 'object-assign';
import {
  SubmissionData,
  SubmissionOptions,
  SubmissionBody,
  SubmissionResponse
} from '../forms';
import { encode, append, clientHeader } from '../util';
import { Session } from '../session';

const now = (): number => {
  // @ts-ignore
  return 1 * new Date();
};

const serializeBody = (data: SubmissionData): FormData | string => {
  if (data instanceof FormData) return data;
  return JSON.stringify(data);
};

export default function submitForm(
  site: string,
  session: Session,
  key: string,
  data: SubmissionData,
  opts: SubmissionOptions = {}
): Promise<SubmissionResponse> {
  let endpoint = opts.endpoint || 'https://api.statickit.com';
  let fetchImpl = opts.fetchImpl || fetchPonyfill({ Promise }).fetch;
  let url = `${endpoint}/j/sites/${site}/forms/${key}/submissions`;

  let sessionWithTime = objectAssign({}, session.data(), {
    submittedAt: now()
  });

  append(data, '_t', encode(sessionWithTime));

  let headers: { [key: string]: string } = {
    'StaticKit-Client': clientHeader(opts.clientName)
  };

  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let request = {
    method: 'POST',
    mode: 'cors' as const,
    body: serializeBody(data),
    headers
  };

  return fetchImpl(url, request).then(response => {
    return response.json().then(
      (body: SubmissionBody): SubmissionResponse => {
        return { body, response };
      }
    );
  });
}
