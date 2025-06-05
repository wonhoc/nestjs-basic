import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 이게 UserRepository를 제공합니다
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 다른 모듈에서 UserService를 사용할 수 있도록 export
})
export class UserModule {}
