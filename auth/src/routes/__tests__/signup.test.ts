import request from 'supertest';

import { app } from '@/app';
import { SIGNUP_ENDPOINT } from '@/routes/signup';
import { User } from '@/models';
import { PasswordHash } from '@/utils';

/**
 * Available methods in /api/auth/signup
 *  - POST
 */
describe('tests signup route method availability', () => {
  let email = '';
  let password = '';

  beforeAll(() => {
    email = 'test@test.com';
    password = 'Validpassword1';
  });

  it('should return 405 for NON-POST requests (GET, PUT, DELETE, PATCH) to the signup route', async () => {
    await request(app)
      .get(SIGNUP_ENDPOINT)
      .send({
        email,
        password,
      })
      .expect(405);

    await request(app)
      .put(SIGNUP_ENDPOINT)
      .send({
        email,
        password,
      })
      .expect(405);

    await request(app)
      .patch(SIGNUP_ENDPOINT)
      .send({
        email,
        password,
      })
      .expect(405);

    await request(app)
      .delete(SIGNUP_ENDPOINT)
      .send({
        email,
        password,
      })
      .expect(405);
  });

  it('should return 201 for POST and OPTIONS requests to the signup route', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({
        email,
        password,
      })
      .expect(201);
  });

  it('should return POST and OPTIONS as the only allowed method from an OPTIONS request', async () => {
    const response = await request(app).options(SIGNUP_ENDPOINT);
    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-methods']).toContain(
      'OPTIONS'
    );
  });
});

/**
 * Valid email conditions:
 *  - Standard email formats from 'express-validator' package
 */
describe('tests validity of email input', () => {
  let password = '';

  beforeAll(() => {
    password = 'Validpassword1';
  });

  it('should return 422 if the email is not provided', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({
        email: undefined,
        password,
      })
      .expect(422);
  });

  it('should return 422 if the email is not valid', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email: '123', password })
      .expect(422);
  });

  it('should return 201 if the email is valid', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email: 'test@test.com', password })
      .expect(201);
  });
});

/**
 * Valid password conditions:
 *  - At least 8 characters
 *  - At most 32 characters
 *  - At least one uppercase
 *  - At least one lowercase
 *  - One number
 */
describe('test validatity of password input', () => {
  let email = '';

  beforeAll(() => {
    email = 'test@test.com';
  });

  it('should return 422 if the password is not provided', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({
        email,
        password: undefined,
      })
      .expect(422);
  });

  it('should return 422 if the password contains less than 8 characters', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({
        email,
        password: '1nvaLd',
      })
      .expect(422);
  });

  it('should return 422 if the `trimmed` password contains less than 8 characters', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({
        email,
        password: '1nvaLd                  ',
      })
      .expect(422);
  });

  it('should return 422 if the password contains more than 32 characters', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email, password: '1nvaLd78901234567890123edfrtgyhuu' })
      .expect(422);
  });

  it('should return 422 if the password does not contain a lowercase letter', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email, password: 'INVALID1INVALID1' })
      .expect(422);
  });

  it('should return 422 if the password does not contain a uppercase letter', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email, password: 'invalid1invalid1' })
      .expect(422);
  });

  it('should return 422 if the password does not contain a number', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email, password: 'InvalidInvalid' })
      .expect(422);
  });

  it('should return 201 if the password is valid', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email, password: 'Validpassword1' })
      .expect(201);
  });
});

describe('tests sanitization of email input', () => {
  it('should not contain uppercase letters in the domain of the email', async () => {
    const email = 'Test@TEST.com';
    const normalizedEmail = email.toLowerCase();

    const response = await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email, password: 'Valid123456' })
      .expect(201);

    expect(response.body.email).toBe(normalizedEmail);
  });
});

describe('tests sanitzation of password input', () => {
  it('should not contain unescaped characters', async () => {
    const password = '<script>attack()</script>';
    // it should escape password like this:
    //  '&lt;script&gt;attack()&lt;&#x2F;script&gt;'
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email: 'test@test.com', password });
  });
});

describe('saving signed up user to database', () => {
  const userInfo = {
    email: 'test@test.com',
    password: 'Valid123',
  };
  it('saves user successfully as long as user info is valid', async () => {
    // send valid user info
    const response = await request(app)
      .post(SIGNUP_ENDPOINT)
      .send(userInfo)
      .expect(201);

    // Receive the user info back from the route
    expect(response.body.email).toEqual(userInfo.email);

    // check whether user can be found in the db
    const user = await User.findOne({ email: response.body.email });
    expect(user).toBeDefined();
    expect(user?.email).toBe(userInfo.email);
  });

  it('does not allow saving a user with a duplicate email', async () => {
    await request(app).post(SIGNUP_ENDPOINT).send(userInfo).expect(201);

    const response = await request(app)
      .post(SIGNUP_ENDPOINT)
      .send(userInfo)
      .expect(422);

    expect(response.body.errors).toMatchInlineSnapshot(`
      Array [
        Object {
          "message": "The email is already in the database",
        },
      ]
    `);
  });

  it('should not include the user password on the response', async () => {
    const response = await request(app)
      .post(SIGNUP_ENDPOINT)
      .send(userInfo)
      .expect(201);
    expect(response.body.password).toBeUndefined();
  });

  it('encrypts the user password when saving the user to the database', async () => {
    await request(app).post(SIGNUP_ENDPOINT).send(userInfo).expect(201);

    const newUser = await User.findOne({ email: userInfo.email });
    const newUserPassword = newUser?.password;
    expect(newUserPassword?.length).toBeGreaterThan(0);
    expect(newUserPassword).not.toEqual(userInfo.password);
  });

  it('should return true when comparing the hashedPassowrd with its original providedPassword', async () => {
    const newUser = await User.create(userInfo);

    expect(
      PasswordHash.compareSync({
        providedPassword: 'something-random',
        storedPassword: newUser.password,
      })
    ).toEqual(false);

    expect(
      PasswordHash.compareSync({
        providedPassword: userInfo.password,
        storedPassword: newUser.password,
      })
    ).toEqual(true);
  });
});
