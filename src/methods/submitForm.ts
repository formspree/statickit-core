import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import objectAssign from 'object-assign';
import { encode, append } from '../util';
import { version } from '../../package.json';
import { Session } from '../session';

export interface Props {
  id?: string;
  site?: string;
  form?: string;
  data?: FormData | object | undefined;
  endpoint?: string | undefined;
  clientName?: string;
  fetchImpl?: typeof fetch | undefined;
}

interface SuccessResponse {
  id: string;
  data: object;
}

interface ErrorResponse {
  errors: Array<{
    field: string;
    message: string;
    code: string | null;
    properties: object;
  }>;
}

type ResponseBody = SuccessResponse | ErrorResponse;
export type Result = { body: ResponseBody; response: Response };

const serializeBody = (data: FormData | object): FormData | string => {
  if (data instanceof FormData) return data;
  return JSON.stringify(data);
};

const submissionUrl = (props: Props) => {
  const { id, site, form } = props;
  const endpoint = props.endpoint || 'https://api.statickit.com';

  if (site && form) {
    return `${endpoint}/j/sites/${site}/forms/${form}/submissions`;
  } else {
    return `${endpoint}/j/forms/${id}/submissions`;
  }
};

const clientHeader = ({ clientName }: Props) => {
  const label = `@statickit/core@${version}`;
  if (!clientName) return label;
  return `${clientName} ${label}`;
};

export default function submitForm(
  session: Session,
  props: Props = {}
): Promise<Result> {
  if (!props.id && !(props.site && props.form)) {
    throw new Error('`site` and `form` properties are required');
  }

  let fetchImpl = props.fetchImpl || fetchPonyfill({ Promise }).fetch;
  let url = submissionUrl(props);
  let data = props.data || {};
  let sessionWithTime = objectAssign({}, session, {
    // @ts-ignore
    submittedAt: 1 * new Date()
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
    return response.json().then(body => {
      return { body, response };
    });
  });
}
