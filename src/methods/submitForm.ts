import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import objectAssign from 'object-assign';
import { SubmissionProps, SubmissionBody, SubmissionResult } from '../forms';
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

const submissionUrl = (props: SubmissionProps) => {
  const { id, site, form } = props;
  const endpoint = props.endpoint || 'https://api.statickit.com';

  if (site && form) {
    return `${endpoint}/j/sites/${site}/forms/${form}/submissions`;
  } else {
    return `${endpoint}/j/forms/${id}/submissions`;
  }
};

const clientHeader = ({ clientName }: SubmissionProps) => {
  const label = `@statickit/core@${version}`;
  if (!clientName) return label;
  return `${clientName} ${label}`;
};

export default function submitForm(
  session: Session,
  props: SubmissionProps
): Promise<SubmissionResult> {
  if (!props.id && !(props.site && props.form)) {
    throw new Error('`site` and `form` properties are required');
  }

  let fetchImpl = props.fetchImpl || fetchPonyfill({ Promise }).fetch;
  let url = submissionUrl(props);
  let data = props.data || {};
  let sessionWithTime = objectAssign({}, session.data(), {
    submittedAt: now()
  });

  append(data, '_t', encode(sessionWithTime));

  let headers: { [key: string]: string } = {
    'StaticKit-Client': clientHeader(props)
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
