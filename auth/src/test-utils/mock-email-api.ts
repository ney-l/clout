import {
  EmailApiSendEmailArgs,
  EmailApiSendEmailResponse,
  EmailSenderEmailApi,
} from '@/utils';

export const mockSendSignUpVerificationEmail = jest.fn(
  (toEmail: string): Promise<EmailApiSendEmailResponse> =>
    Promise.resolve({ toEmail, status: 'success' })
);

export const mockSendEmail = jest.fn();

export class MockEmailApi extends EmailSenderEmailApi {
  sendSignUpVerificationEmail({
    toEmail,
  }: EmailApiSendEmailArgs): Promise<EmailApiSendEmailResponse> {
    this.sendEmail();
    return mockSendSignUpVerificationEmail(toEmail);
  }

  protected sendEmail(): void {
    return mockSendEmail();
  }
}
