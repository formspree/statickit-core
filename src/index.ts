import submitForm from './methods/submitForm';
import invoke from './methods/invoke';
import { GenericArgs, GenericResponse, FunctionOptions } from './functions';
import { SubmissionArgs, SubmissionResult } from './forms';
import { Session } from './session';

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
   * @param args - An object of form submission data.
   */
  submitForm(args: SubmissionArgs): Promise<SubmissionResult> {
    args.site || (args.site = this.site);
    return submitForm(this.session, args);
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
