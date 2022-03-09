import { User } from '@/models';
import { UserSignedUp } from '@/events';

it('should expose only the id and the email when serializing to REST', async () => {
  const testUser = {
    email: 'test@test.com',
    password: 'Valid1234',
  };
  const newUser = await User.create(testUser);
  const userSignedupEvent = new UserSignedUp(newUser);
  const serializedResponse = userSignedupEvent.serializeRest();

  const keys = Object.keys(serializedResponse);
  expect(keys).toContain('id');
  expect(keys).toContain('email');

  expect(serializedResponse.email).toBe(testUser.email);
  expect(userSignedupEvent.getStatusCode()).toEqual(201);
});
