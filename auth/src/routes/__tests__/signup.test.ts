import request from 'supertest';
import { app } from '@/app';
// test("app should return 405 for NON-POST requests (PUT, DELETE, PATCH) to the signup route", () => {})

test('app should return 422 if the email is not valid', async () => {
  await request(app).post('/api/auth/signup').send({}).expect(422);

  await request(app)
    .post('/api/auth/signup')
    .send({ email: '123' })
    .expect(422);
});
