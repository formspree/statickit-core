import { encode, append } from './util';
import assign from 'core-js-pure/stable/object/assign';

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

    window.addEventListener('mousemove', () => {
      this.session.mousemove += 1;
    });

    window.addEventListener('keydown', () => {
      this.session.keydown += 1;
    });
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
    const session = assign({}, this.session, {
      submittedAt: 1 * new Date()
    });

    append(data, '_t', encode(session));

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: data
    });

    const body = await response.json();

    return { body, response };
  }
}

export default StaticKit;
