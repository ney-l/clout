// import { ValidationError } from 'express-validator';
import { ValidationError } from 'express-validator';
import { BaseCustomError } from './base-custom-error';
import {
  SerializedErrorOutput,
  SerializedErrorField,
} from './types/serialized-error-output';

export type InvalidInputConstructorErrorsParams = ValidationError[];

export class InvalidInput extends BaseCustomError {
  protected statusCode = 422;

  private defaultErrorMessage = 'Input does not meet validation criteria';

  protected errors: ValidationError[] | undefined;

  serializedErrorOutput = undefined;

  constructor(errors?: InvalidInputConstructorErrorsParams) {
    super('Input does not meet validation criteria');
    this.errors = errors;

    Object.setPrototypeOf(this, InvalidInput.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return this.parseValidationErrors();
  }

  private parseValidationErrors(): SerializedErrorOutput {
    const parsedErrors: SerializedErrorField = {};

    if (this.errors && this.errors?.length > 0) {
      this.errors?.forEach(({ param, msg }) => {
        if (parsedErrors[param]) {
          parsedErrors[param].push(msg);
        } else {
          parsedErrors[param] = [msg];
        }
      });
    }

    return {
      errors: [
        {
          message: this.defaultErrorMessage,
          fields: parsedErrors,
        },
      ],
    };
  }
}
