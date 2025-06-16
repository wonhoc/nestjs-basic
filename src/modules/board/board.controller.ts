import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation } from '@nestjs/swagger';
import {
  CreateBoardDto,
  UpdateBoardDto,
  DeleteBoardDto,
} from './dto/board.request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiListResponse,
  ApiDetailResponse,
  ApiCreateResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from 'common/decorators/api-response.decorator';

import { CommonSearchDto } from 'src/common/dto/request.dto';

@Controller('/board')
@UseGuards(JwtAuthGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @ApiOperation({
    summary: '게시판 목록 조회',
    description: '게시판의 목록을 조회한다.',
  })
  @ApiListResponse()
  find(@Query() commonSearchDto: CommonSearchDto) {
    return this.boardService.find(commonSearchDto);
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
  @ApiOperation({
    summary: '게시판 등록',
    description: '게시판을 등록한다.',
  })
  @ApiCreateResponse()
  save(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.save(createBoardDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '게시판 수정',
    description: '게시판을 수정한다.',
  })
  @ApiUpdateResponse('게시글 수정 완료', true)
  update(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '게시판 삭제',
    description: '게시판을 삭제한다.',
  })
  @ApiDeleteResponse()
  delete(@Param('id') id: number) {
    return this.boardService.delete(id);
  }
}
