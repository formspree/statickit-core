import { encode, append } from './util';
import './polyfills';

const serializeBody = data => {
  if (data instanceof FormData) return data;
  JSON.stringify(data);
};

class StaticKit {
  constructor() {
    this.session = {
      loadedAt: 1 * new Date(),
      mousemove: 0,
      keydown: 0,
      webdriver:
        navigator.webdriver ||
        document.documentElement.getAttribute('webdriver') ||
        !!window.callPhantom ||
        !!window._phantom
    };

    this._onMouseMove = () => {
      this.session.mousemove += 1;
    };

    this._onKeyDown = () => {
      this.session.keydown += 1;
    };

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('keydown', this._onKeyDown);
  }

  /**
   * Tears down the client instance.
   */
  teardown() {
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('keydown', this._onKeyDown);
  }

  /**
   * Submits a form.
   *
   * @param {object} props
   * @returns {object}
   */
  async submitForm(props) {
    if (!props.id) {
      throw new Error('You must provide an `id` for the form');
    }

    const endpoint = props.endpoint || 'https://api.statickit.com';
    const url = `${endpoint}/j/forms/${props.id}/submissions`;
    const data = props.data || {};
    const session = Object.assign({}, this.session, {
      submittedAt: 1 * new Date()
    });

    append(data, '_t', encode(session));

    const request = {
      method: 'POST',
      mode: 'cors',
      body: serializeBody(data)
    };

    if (!(data instanceof FormData)) {
      request.headers = {
        'Content-Type': 'application/json'
      };
    }

    const response = await fetch(url, request);
    const body = await response.json();

    return { body, response };
  }
}

/**
 * Constructs the client object.
 */
export default () => {
  return new StaticKit();
};
