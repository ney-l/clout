import {
  EmailApiSendEmailArgs,
  EmailApiSendEmailResponse,
  EmailSenderEmailApi,
} from '@/utils';

/**
 * Note: This class follows Singleton Pattern
 */
export class EmailSender {
  private static isActive = false;

  private static emailApi: EmailSenderEmailApi | undefined;

  private static emailSenderInstance: EmailSender;

  private constructor() {
    // no-op
  }

  static getInstance(): typeof EmailSender {
    if (!this.emailSenderInstance) {
      this.emailSenderInstance = new EmailSender();
    }

    return EmailSender;
  }

  static activate(): void {
    this.isActive = true;
  }

  static deactivate(): void {
    this.isActive = false;
  }

  static resetEmailSenderInstance(): void {
    this.emailSenderInstance = new EmailSender();
  }

  static setEmailApi(emailApi: EmailSenderEmailApi): void {
    this.emailApi = emailApi;
  }

  static async sendSignUpVerificationEmail(
    args: EmailApiSendEmailArgs
  ): Promise<EmailApiSendEmailResponse> {
    this.validateEmailSender();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.emailApi!.sendSignUpVerificationEmail(args);
  }

  private static validateEmailSender(): void {
    if (!this.isActive) {
      throw new Error('EmailSender is not active');
    }

    if (!this.emailApi) {
      throw new Error('EmailApi is not set');
    }
  }
}
