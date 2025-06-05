import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService], // 다른 모듈에서 사용할 수 있도록 export
})
export class BoardModule {}
