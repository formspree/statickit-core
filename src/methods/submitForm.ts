import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import objectAssign from 'object-assign';
import { SubmissionArgs, SubmissionBody, SubmissionResult } from '../forms';
import { encode, append } from '../util';
import { version } from '../../package.json';
import { Session } from '../session';

const now = (): number => {
  // @ts-ignore
  return 1 * new Date();
};

const serializeBody = (data: FormData | object): FormData | string => {
  if (data instanceof FormData) return data;
  return JSON.stringify(data);
};

const submissionUrl = (args: SubmissionArgs) => {
  const { id, site, form } = args;
  const endpoint = args.endpoint || 'https://api.statickit.com';

  if (site && form) {
    return `${endpoint}/j/sites/${site}/forms/${form}/submissions`;
  } else {
    return `${endpoint}/j/forms/${id}/submissions`;
  }
};

const clientHeader = ({ clientName }: SubmissionArgs) => {
  const label = `@statickit/core@${version}`;
  if (!clientName) return label;
  return `${clientName} ${label}`;
};

export default function submitForm(
  session: Session,
  args: SubmissionArgs
): Promise<SubmissionResult> {
  if (!args.id && !(args.site && args.form)) {
    throw new Error('`site` and `form` properties are required');
  }

  let fetchImpl = args.fetchImpl || fetchPonyfill({ Promise }).fetch;
  let url = submissionUrl(args);
  let data = args.data || {};
  let sessionWithTime = objectAssign({}, session.data(), {
    submittedAt: now()
  });

  append(data, '_t', encode(sessionWithTime));

  let headers: { [key: string]: string } = {
    'StaticKit-Client': clientHeader(args)
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
      (body: SubmissionBody): SubmissionResult => {
        return { body, response };
      }
    );
  });
}
