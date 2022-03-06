import request from 'supertest';
import { app } from '@/app';
// test("app should return 405 for NON-POST requests (PUT, DELETE, PATCH) to the signup route", () => {})

/**
 * Valid email conditions:
 *  - Standard email formats from 'express-validator' package
 */
describe('test validity of email input', () => {
  let password = '';

  beforeAll(() => {
    password = 'Validpassword1';
  });

  it('should return 422 if the email is not provided', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: undefined,
        password,
      })
      .expect(422);
  });

  it('should return 422 if the email is not valid', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email: '123', password })
      .expect(422);
  });

  it('should return 200 if the email is valid', async () => {
    await request(app)
      .post('/api/auth/signup')
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
      .post('/api/auth/signup')
      .send({
        email,
        password: undefined,
      })
      .expect(422);
  });

  it('should return 422 if the password contains less than 8 characters', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email,
        password: '1nvaLd',
      })
      .expect(422);
  });

  it('should return 422 if the `trimmed` password contains less than 8 characters', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email,
        password: '1nvaLd                  ',
      })
      .expect(422);
  });

  it('should return 422 if the password contains more than 32 characters', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email, password: '1nvaLd78901234567890123edfrtgyhuu' })
      .expect(422);
  });

  it('should return 422 if the password does not contain a lowercase letter', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email, password: 'INVALID1INVALID1' })
      .expect(422);
  });

  it('should return 422 if the password does not contain a uppercase letter', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email, password: 'invalid1invalid1' })
      .expect(422);
  });

  it('should return 422 if the password does not contain a number', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email, password: 'InvalidInvalid' })
      .expect(422);
  });

  it('should return 200 if the password is valid', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ email, password: 'Validpassword1' })
      .expect(200);
  });
});
