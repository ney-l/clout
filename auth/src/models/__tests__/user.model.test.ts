import { BaseCustomError, DuplicatedEmail } from '@/errors';
import { User } from '../user.model';

it('should not save a user if the email already exists in the db', async () => {
  const userInfo = {
    email: 'test@test.com',
    password: 'Valid123',
  };

  const newUser1 = await User.create(userInfo);
  expect(newUser1).toBeDefined();
  expect(newUser1.email).toEqual(userInfo.email);

  let err: DuplicatedEmail | undefined;

  try {
    await User.create(userInfo);
  } catch (error) {
    err = error as DuplicatedEmail;
  }

  if (err instanceof DuplicatedEmail) {
    const serializedErrorOutput = err.serializeErrorOutput();
    expect(err).toBeDefined();
    expect(err).toBeInstanceOf(BaseCustomError);
    expect(serializedErrorOutput).toBeDefined();
    expect(serializedErrorOutput.errors[0].message).toMatchInlineSnapshot(
      `"The email is already in the database"`
    );
  } else {
    throw new Error('err is not an instance of DuplicatedEmail');
  }
});
