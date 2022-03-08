import { BaseCustomError } from './base-custom-error';

export class InvalidInput extends BaseCustomError {
  statusCode = 422;

  constructor() {
    super('user input does not meet validation criteria');

    Object.setPrototypeOf(this, InvalidInput);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): unknown {
    return undefined;
  }
}
