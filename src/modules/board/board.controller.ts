import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation } from '@nestjs/swagger';
import {
  SearchBoardsDto,
  CreateBoardDto,
  UpdateBoardDto,
} from './dto/board.request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiListResponse,
  ApiDetailResponse,
  ApiCreateResponse,
  ApiUpdateResponse,
} from 'common/decorators/api-response.decorator';

@Controller('/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @ApiOperation({
    summary: '게시판 목록 조회',
    description: '게시판의 목록을 조회한다.',
  })
  @ApiListResponse()
  find(@Query() searchBoardsDto: SearchBoardsDto) {
    return this.boardService.find(searchBoardsDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '게시판 상세 조회',
    description: '게시판을 상세하게 조회한다.',
  })
  @ApiDetailResponse()
  findOne(@Param('id') id: number) {
    return this.boardService.findOneById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시판 등록',
    description: '게시판을 등록한다.',
  })
  @ApiCreateResponse()
  save(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.save(createBoardDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시판 수정',
    description: '게시판을 수정한다.',
  })
  @ApiUpdateResponse('게시글 수정 완료', true)
  update(@Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.save(updateBoardDto);
  }
}
