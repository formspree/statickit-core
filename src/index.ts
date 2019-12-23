import submitForm, { Props as SubmitFormProps } from './api/submitForm';
import { Session } from './session';

interface Config {
  site?: string;
}

class StaticKit {
  site: string | undefined;
  private _session: Session;
  private _onMouseMove: () => void;
  private _onKeyDown: () => void;

  constructor(props: Config) {
    this.site = props.site;

    this._session = {
      // @ts-ignore
      loadedAt: 1 * new Date(),
      mousemove: 0,
      keydown: 0,
      webdriver:
        navigator.webdriver ||
        !!document.documentElement.getAttribute('webdriver') ||
        // @ts-ignore
        !!window.callPhantom ||
        // @ts-ignore
        !!window._phantom
    };

    this._onMouseMove = () => {
      this._session.mousemove += 1;
    };

    this._onKeyDown = () => {
      this._session.keydown += 1;
    };

    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('keydown', this._onKeyDown);
  }

  teardown(): void {
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('keydown', this._onKeyDown);
  }

  submitForm(props: SubmitFormProps = {}): any {
    props.site || (props.site = this.site);
    return submitForm(this._session, props);
  }
}

/**
 * Constructs the client object.
 */
export default (props?: Config): StaticKit => {
  return new StaticKit(props || {});
};
