import { InvalidInput } from '@/errors';
import { InvalidInputConstructorErrorsParams } from '@/errors';

it(' should have a status code of 422', () => {
  const invalidInputError = new InvalidInput();
  expect(invalidInputError.getStatusCode()).toEqual(422);
});

it('should return the errors in the serialized format', () => {
  const errors: InvalidInputConstructorErrorsParams = [
    {
      value: 'Valid12',
      msg: 'Password must be between 8 and 32 characters',
      param: 'password',
      location: 'body',
    },
    {
      value: 'Valid12',
      msg: 'Password must contain an uppercase letter',
      param: 'password',
      location: 'body',
    },
  ];

  const invalidInputError = new InvalidInput(errors);
  const serializedErrors = invalidInputError.serializeErrorOutput();
  expect(serializedErrors.errors).toHaveLength(1);

  const { fields = {} } = serializedErrors.errors[0];

  expect(serializedErrors.errors[0].message).toEqual(
    'Input does not meet validation criteria'
  );
  expect(Object.keys(fields)).toHaveLength(1);
  expect(Object.keys(fields)).toEqual(['password']);
  expect(fields.password).toHaveLength(2);
  expect(fields.password).toContain(
    'Password must be between 8 and 32 characters'
  );
  expect(fields.password).toContain(
    'Password must contain an uppercase letter'
  );
});
