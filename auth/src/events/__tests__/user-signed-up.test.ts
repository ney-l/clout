import { randomBytes } from 'crypto';

import { User } from '@/models';
import { UserSignedUp } from '@/events';

describe('tests the User mongoose model', () => {
  const userInfo = {
    email: 'test@test.com',
    password: 'Valid1234',
  };

  it('should expose only the id and the email when serializing to REST', async () => {
    const newUser = await User.create(userInfo);
    const userSignedupEvent = new UserSignedUp(newUser);
    const serializedResponse = userSignedupEvent.serializeRest();

    const keys = Object.keys(serializedResponse);
    expect(keys).toContain('id');
    expect(keys).toContain('email');

    expect(serializedResponse.email).toBe(userInfo.email);
    expect(userSignedupEvent.getStatusCode()).toEqual(201);
  });

  it('should encrypt the password when creating the user', async () => {
    const newUser = await User.create(userInfo);
    expect(newUser.password).not.toEqual(userInfo.password);
    expect(newUser.password.split('.')).toHaveLength(2);
    expect(newUser.password.split('.')[1].length).toEqual(
      randomBytes(16).toString('hex').length
    );
  });
});
