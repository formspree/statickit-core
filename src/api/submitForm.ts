import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import objectAssign from 'object-assign';
import { encode, append } from '../util';
import { version } from '../../package.json';
import { Session } from '../session';

export interface Props {
  site?: string;
}

const serializeBody = data => {
  if (data instanceof FormData) return data;
  return JSON.stringify(data);
};

const submissionUrl = props => {
  const { id, site, form } = props;
  const endpoint = props.endpoint || 'https://api.statickit.com';

  if (site && form) {
    return `${endpoint}/j/sites/${site}/forms/${form}/submissions`;
  } else {
    return `${endpoint}/j/forms/${id}/submissions`;
  }
};

const clientHeader = ({ clientName }) => {
  const label = `@statickit/core@${version}`;
  if (!clientName) return label;
  return `${clientName} ${label}`;
};

export default function submitForm(session: Session, props: Props = {}) {
  if (!props.id && !(props.site && props.form)) {
    throw new Error('`site` and `form` properties are required');
  }

  const fetchImpl = props.fetchImpl || fetchPonyfill({ Promise }).fetch;
  const url = submissionUrl(props);
  const data = props.data || {};
  const sessionWithTime = objectAssign({}, session, {
    submittedAt: 1 * new Date()
  });

  append(data, '_t', encode(sessionWithTime));

  const request = {
    method: 'POST',
    mode: 'cors',
    body: serializeBody(data),
    headers: {
      'StaticKit-Client': clientHeader(props)
    }
  };

  if (!(data instanceof FormData)) {
    request.headers['Content-Type'] = 'application/json';
  }

  return fetchImpl(url, request).then(response => {
    return response.json().then(body => {
      return { body, response };
    });
  });
}
