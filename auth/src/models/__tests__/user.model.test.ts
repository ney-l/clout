import { User } from '../user.model';

it('should not save a user if the email already exists in the db', async () => {
  const userInfo = {
    email: 'test@test.com',
    password: 'Valid123',
  };

  const newUser1 = await User.create(userInfo);
  expect(newUser1).toBeDefined();
  expect(newUser1.email).toEqual(userInfo.email);

  let error;

  try {
    await User.create(userInfo);
  } catch (err) {
    error = err;
  }
  expect(error).toBeDefined();
  expect(error instanceof Error).toBe(true);

  if (error instanceof Error) {
    expect(error.message).toMatchInlineSnapshot(`"email is already in the db"`);
  }
});
