import submitForm from './methods/submitForm';
import invoke from './methods/invoke';
import { GenericArgs, GenericResponse, FunctionOptions } from './functions';
import { SubmissionOptions, SubmissionResult } from './forms';
import { Session } from './session';

export interface Config {
  site: string;
}

export class StaticKit {
  site: string;
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
   * @param key - The form key.
   * @param data - An object or FormData instance containing submission data.
   * @param args - An object of form submission data.
   */
  submitForm(
    key: string,
    data: FormData | object,
    opts: SubmissionOptions = {}
  ): Promise<SubmissionResult> {
    return submitForm(this.site, this.session, key, data, opts);
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
    args: GenericArgs,
    opts: FunctionOptions = {}
  ): Promise<GenericResponse> {
    return invoke(this.site, name, args, opts);
  }
}

/**
 * Constructs the client object.
 */
export const createClient = (config: Config): StaticKit => {
  return new StaticKit(config);
};
