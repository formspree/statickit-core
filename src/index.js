import { encode, append } from './util';

import Promise from 'promise-polyfill';
import fetchPonyfill from 'fetch-ponyfill';
import objectAssign from 'object-assign';
import { version } from '../package.json';

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

/**
 * The client constructor.
 */
function StaticKit() {
  this.session = {
    loadedAt: 1 * new Date(),
    webdriver:
      navigator.webdriver ||
      document.documentElement.getAttribute('webdriver') ||
      !!window.callPhantom ||
      !!window._phantom
  };
}

/**
 * Tears down the client instance.
 */
StaticKit.prototype.teardown = function teardown() {};

/**
 * Submits a form.
 *
 * Returns a `Promise` that resolves to `{body, response}`.
 *
 * @param {object} props
 * @returns {Promise}
 */
StaticKit.prototype.submitForm = function submitForm(props) {
  if (!props.id && !(props.site && props.form)) {
    throw new Error('You must set an `id` or `site` & `form` properties');
  }

  const fetchImpl = props.fetchImpl || fetchPonyfill({ Promise }).fetch;
  const url = submissionUrl(props);
  const data = props.data || {};

  append(data, '_t', encode(this.session));

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
};

/**
 * Constructs the client object.
 */
export default () => {
  return new StaticKit();
};
