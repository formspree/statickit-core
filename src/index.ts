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

export class StaticKit {
  site: string | undefined;
  private session: Session;

  constructor(config: Config) {
    this.site = config.site;
    this.session = new Session();
  }

  /**
   * Teardown the client session.
   */
  teardown(): void {
    this.session.teardown();
  }

  /**
   * Submit a form.
   *
   * @param props - Form submission properties
   */
  submitForm(props: SubmitFormProps): Promise<SubmitFormResult> {
    props.site || (props.site = this.site);
    return submitForm(this.session, props);
  }

  /**
   * Invoke a function.
   *
   * @param name - The function name
   * @param args - An object of function arguments
   * @param opts - An object of options
   */
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
