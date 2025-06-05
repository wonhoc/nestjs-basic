import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { CustomApiException } from 'src/common/exceptions/custom-api.exception';
import { ErrorCode } from 'src/common/exceptions/errorCode.type';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/board.request.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  // 게시글 목록 조회
  async find(keyword: string): Promise<Board[]> {
    const boards: Board[] | null = await this.boardRepository.find();

    return boards;
  }

  // 게시글 조회
  async findOneById(id: number): Promise<Board> {
    const board: Board | null = await this.boardRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new CustomApiException(ErrorCode.COMM_FIND_ERROR);
    }

    return board;
  }

  // 게시글 등록
  @Transactional()
  async save(createBoardDto: CreateBoardDto) {
    await this.boardRepository.save({
      title: createBoardDto.title,
      content: createBoardDto.content,
    });
  }

  // 게시글 수정
  @Transactional()
  async update(id: number, refreshToken: string) {
    const board: Board | null = await this.boardRepository.findOneBy({ id });

    if (board == null) throw new CustomApiException(ErrorCode.COMM_FIND_ERROR);
  }
}
