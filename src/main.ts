import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
async function bootstrap() {
  // Transactional 설정
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  // cors 설정
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'], // 허용할 도메인
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
    credentials: true, // 쿠키 포함 요청 허용
  });

  // Transactional 설정
  const dataSource = app.get(DataSource);
  addTransactionalDataSource(dataSource);

  // swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('기본 틀 API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 환경 설정에서 포트 가져오기
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);

  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/main');
  app.setGlobalPrefix(apiPrefix);
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
