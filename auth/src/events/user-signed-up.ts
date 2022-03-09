import { UserDocument } from '@/models';
import { BaseAuthEvent } from '@/events/base-auth-event';
import { STATUS_CODES } from '@/constants/statusCodes';

export type UserSignedUpRestPayload = {
  id: string;
  email: string;
};

export class UserSignedUp extends BaseAuthEvent<UserSignedUpRestPayload> {
  private user: UserDocument;

  protected statusCode = STATUS_CODES.CREATED;

  constructor(user: UserDocument) {
    super();
    this.user = user;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeRest(): UserSignedUpRestPayload {
    return {
      id: this.user._id,
      email: this.user.email,
    };
  }
}
