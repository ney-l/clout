import { randomBytes, scryptSync } from 'crypto';

export type PasswordHashToHashSyncArgs = {
  password: string;
};

export type PasswordHashCompareSyncArgs = {
  providedPassword: string;
  storedPassword: string;
};

const PASSWORD_HASH_KEY_LEN = 64;

export class PasswordHash {
  static toHashSync(args: PasswordHashToHashSyncArgs): string {
    const { password } = args;

    const salt = randomBytes(16).toString('hex');
    const buffer = scryptSync(password, salt, PASSWORD_HASH_KEY_LEN);

    return `${buffer.toString('hex')}.${salt}`;
  }

  static compareSync(args: PasswordHashCompareSyncArgs): boolean {
    const { providedPassword, storedPassword } = args;

    const [hash, salt] = storedPassword.split('.');
    const buffer = scryptSync(providedPassword, salt, PASSWORD_HASH_KEY_LEN);

    return buffer.toString('hex') === hash;
  }
}
