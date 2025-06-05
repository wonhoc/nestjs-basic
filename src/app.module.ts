import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';

@Module({
  imports: [
    // 환경 설정 로드
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),

    // 데이터베이스 연결
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('database.synchronize'),
      }),
    }),
    UserModule,
    AuthModule,
    BoardModule,
  ],
})
export class AppModule {}
