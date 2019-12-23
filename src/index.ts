import submitForm from './api/submitForm';

/**
 * The client constructor.
 */
function StaticKit(props = {}) {
  this.site = props.site;

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
StaticKit.prototype.teardown = function() {
  window.removeEventListener('mousemove', this._onMouseMove);
  window.removeEventListener('keydown', this._onKeyDown);
};

/**
 * Submits a form.
 *
 * Returns a `Promise` that resolves to `{body, response}`.
 *
 * @param {object} props
 * @returns {Promise}
 */
StaticKit.prototype.submitForm = function(props = {}) {
  props.site || (props.site = this.site);
  return submitForm(this.session, props);
};

/**
 * Constructs the client object.
 */
export default (...args) => {
  return new StaticKit(...args);
};
