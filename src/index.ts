import submitForm, { Result as SubmissionResult } from './methods/submitForm';
import invoke, { Result as InvokeResult } from './methods/invoke';
import { Session } from './session';

export interface SubmissionProps {
  id?: string;
  site?: string;
  form?: string;
  data: FormData | object;
  endpoint?: string;
  clientName?: string;
  fetchImpl?: typeof fetch;
}

export interface InvokeOptions {
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
   * @param props - Form submission properties.
   */
  submitForm(props: SubmissionProps): Promise<SubmissionResult> {
    props.site || (props.site = this.site);
    return submitForm(this.session, props);
  }

  /**
   * Invoke a function.
   *
   * @param name - The function name.
   * @param args - An object of function arguments.
   * @param opts - An object of options.
   */
  invoke(
    name: string,
    args: object,
    opts: InvokeOptions
  ): Promise<InvokeResult> {
    opts.site || (opts.site = this.site);
    return invoke(name, args, opts);
  }
}

/**
 * Constructs the client object.
 */
export const createClient = (config?: Config): StaticKit => {
  return new StaticKit(config || {});
};
