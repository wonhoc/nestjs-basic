import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: '사용자 ID로 조회',
    description: 'ID로 사용자 정보를 조회합니다.',
  })
  findOne(@Param('id') id: number) {
    return this.userService.findOneById(id);
  }
}
