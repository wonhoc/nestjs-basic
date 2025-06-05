import { HttpException } from '@nestjs/common';
import { ErrorCodeInfo } from './errorCode.type';

export class CustomApiException extends HttpException {
  public readonly errorCode: ErrorCodeInfo;

  constructor(errorCode: ErrorCodeInfo, message?: string) {
    const responseMessage = message || errorCode.message;
    const httpStatus = errorCode.httpStatus || 500;

    super(
      {
        success: false,
        errorCode: errorCode.code,
        message: responseMessage,
        timestamp: new Date().toISOString(),
      },
      httpStatus,
    );

    this.errorCode = errorCode;
    this.name = 'CustomApiException';
  }

  getErrorCode(): string {
    return this.errorCode.code;
  }

  getErrorMessage(): string {
    return this.errorCode.message;
  }
}
