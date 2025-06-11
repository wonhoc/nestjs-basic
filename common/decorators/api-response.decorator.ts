// src/common/decorators/api-response.decorator.ts
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 응답 타입 메타데이터 키
const RESPONSE_CONFIG_KEY = 'responseConfig';

// 응답 설정 인터페이스
interface ResponseConfig {
  type: 'list' | 'create' | 'update' | 'delete' | 'detail';
  message?: string;
  wrapData?: boolean;
}

// 응답 처리 인터셉터
@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const responseConfig = this.reflector.get<ResponseConfig>(
      RESPONSE_CONFIG_KEY,
      context.getHandler(),
    );

    if (!responseConfig) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const request = context.switchToHttp().getRequest();

        switch (responseConfig.type) {
          case 'list':
            return {
              success: true,
              data,
              message: responseConfig.message || '목록 조회 성공',
              timestamp: new Date().toISOString(),
              path: request.url,
            };

          case 'create':
            return {
              success: true,
              data,
              message: responseConfig.message || '생성되었습니다.',
              id: data?.id,
              timestamp: new Date().toISOString(),
            };

          case 'update':
            return {
              success: true,
              data: responseConfig.wrapData ? data : undefined,
              message: responseConfig.message || '수정되었습니다.',
              timestamp: new Date().toISOString(),
            };

          case 'delete':
            return {
              success: true,
              message: responseConfig.message || '삭제되었습니다.',
              timestamp: new Date().toISOString(),
            };

          case 'detail':
            return {
              success: true,
              data,
              message: responseConfig.message || '조회 성공',
              timestamp: new Date().toISOString(),
            };

          default:
            return {
              success: true,
              data,
              timestamp: new Date().toISOString(),
            };
        }
      }),
    );
  }
}

// 데코레이터 함수들
export const ApiListResponse = (message?: string) =>
  applyDecorators(
    SetMetadata(RESPONSE_CONFIG_KEY, { type: 'list', message }),
    UseInterceptors(ApiResponseInterceptor),
    ApiOkResponse({
      description: message || '목록 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          timestamp: { type: 'string' },
          path: { type: 'string' },
        },
      },
    }),
  );

export const ApiCreateResponse = (message?: string) =>
  applyDecorators(
    SetMetadata(RESPONSE_CONFIG_KEY, { type: 'create', message }),
    UseInterceptors(ApiResponseInterceptor),
    ApiOkResponse({
      description: message || '생성 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          id: { type: 'number' },
          timestamp: { type: 'string' },
        },
      },
    }),
  );

export const ApiUpdateResponse = (message?: string, wrapData = false) => {
  const properties: any = {
    success: { type: 'boolean' },
    message: { type: 'string' },
    timestamp: { type: 'string' },
  };

  if (wrapData) {
    properties.data = { type: 'object' };
  }

  return applyDecorators(
    SetMetadata(RESPONSE_CONFIG_KEY, { type: 'update', message, wrapData }),
    UseInterceptors(ApiResponseInterceptor),
    ApiOkResponse({
      description: message || '수정 성공',
      schema: {
        properties,
      },
    }),
  );
};

export const ApiDeleteResponse = (message?: string) =>
  applyDecorators(
    SetMetadata(RESPONSE_CONFIG_KEY, { type: 'delete', message }),
    UseInterceptors(ApiResponseInterceptor),
    ApiOkResponse({
      description: message || '삭제 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          timestamp: { type: 'string' },
        },
      },
    }),
  );

export const ApiDetailResponse = (message?: string) =>
  applyDecorators(
    SetMetadata(RESPONSE_CONFIG_KEY, { type: 'detail', message }),
    UseInterceptors(ApiResponseInterceptor),
    ApiOkResponse({
      description: message || '상세 조회 성공',
      schema: {
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          timestamp: { type: 'string' },
        },
      },
    }),
  );
