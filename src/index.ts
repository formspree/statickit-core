import submitForm, {
  Props as SubmitFormProps,
  Result as SubmitFormResult
} from './methods/submitForm';

import invoke, {
  Options as InvokeOptions,
  Result as InvokeResult
} from './methods/invoke';

import { Session } from './session';

export interface Options {
  site?: string;
  endpoint?: string;
  clientName?: string;
  fetchImpl?: typeof fetch;
}

export interface Config {
  site?: string;
}

const webdriver = (): boolean => {
  return (
    navigator.webdriver ||
    !!document.documentElement.getAttribute('webdriver') ||
    // @ts-ignore
    !!window.callPhantom ||
    // @ts-ignore
    !!window._phantom
  );
};

const now = (): number => {
  // @ts-ignore
  return 1 * new Date();
};

export class StaticKit {
  site: string | undefined;
  private session: Session;
  private _onMouseMove: () => void;
  private _onKeyDown: () => void;

  constructor(config: Config) {
    this.site = config.site;

    this.session = {
      mousemove: 0,
      keydown: 0,
      loadedAt: now(),
      webdriver: webdriver()
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

  teardown(): void {
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('keydown', this._onKeyDown);
  }

  submitForm(props: SubmitFormProps): Promise<SubmitFormResult> {
    props.site || (props.site = this.site);
    return submitForm(this.session, props);
  }

  invoke(name: string, args: object, opts: Options): Promise<InvokeResult> {
    opts.site || (opts.site = this.site);
    if (!opts.site) throw new Error('`site` is required');
    return invoke(name, args, opts as InvokeOptions);
  }
}

/**
 * Constructs the client object.
 */
export const createClient = (config?: Config): StaticKit => {
  return new StaticKit(config || {});
};
