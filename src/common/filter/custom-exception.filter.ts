import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomApiException } from '../exceptions/custom-api.exception';

@Catch(CustomApiException) // CustomApiException만 캐치하도록 변경
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: CustomApiException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    this.logger.error(
      `Custom API Exception: ${exception.getErrorCode()} - ${exception.getErrorMessage()}`,
      exception.stack,
    );

    // 요청 정보 로깅
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${request.ip}`,
    );

    response.status(status).json(errorResponse);
  }
}
