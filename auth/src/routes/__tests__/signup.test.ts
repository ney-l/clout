import request from 'supertest';
import { app } from '@/app';
import { SIGNUP_ENDPOINT } from '@/routes/signup';

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

  it('should return 200 for POST and OPTIONS requests to the signup route', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({
        email,
        password,
      })
      .expect(200);
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

  it('should return 200 if the email is valid', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email: 'test@test.com', password })
      .expect(200);
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

  it('should return 200 if the password is valid', async () => {
    await request(app)
      .post(SIGNUP_ENDPOINT)
      .send({ email, password: 'Validpassword1' })
      .expect(200);
  });
});
