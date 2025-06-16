import { Repository, EntityManager, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { CustomApiException } from 'src/common/exceptions/custom-api.exception';
import { ErrorCode } from 'src/common/exceptions/errorCode.type';
import { Injectable } from '@nestjs/common';
import {
  SearchBoardsDto,
  CreateBoardDto,
  UpdateBoardDto,
  DeleteBoardDto,
} from './dto/board.request.dto';
import { Transactional } from 'typeorm-transactional';
import { CommonSearchDto } from 'src/common/dto/request.dto';
import { Paginate } from 'common/decorators/paginate.decorator';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  // 게시글 목록 조회
  @Paginate()
  async find(commonSearchDto: CommonSearchDto) {
    const queryBuilder = this.boardRepository.createQueryBuilder('board');

    if (commonSearchDto.keyword) {
      queryBuilder.where('board.title LIKE :keyword', {
        keyword: `%${commonSearchDto.keyword}%`,
      });
    }

    queryBuilder.orderBy('board.createdDtm', 'DESC');

    return queryBuilder; // 데코레이터가 자동으로 PaginatedResponseDto로 변환
  }

  // 게시글 조회
  async findOneById(id: number): Promise<Board> {
    const board: Board | null = await this.boardRepository.findOne({
      where: { id },
    });

    if (!board) {
      throw new CustomApiException(ErrorCode.COMM_FIND_ERROR);
    }
    console.log(board);
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
  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const board: Board | null = await this.boardRepository.findOne({
      where: { id },
    });

    if (board == null) throw new CustomApiException(ErrorCode.COMM_FIND_ERROR);

    await this.boardRepository.update(id, updateBoardDto);
  }

  // 게시글 삭제
  @Transactional()
  async delete(id: number) {
    const board: Board | null = await this.boardRepository.findOne({
      where: { id },
    });

    if (board == null) throw new CustomApiException(ErrorCode.COMM_FIND_ERROR);

    await this.boardRepository.update(id, { deleted: true });
  }
}
