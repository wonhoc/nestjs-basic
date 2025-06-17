import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import {
  CreateMenuDto,
  UpdateMenuDto,
  MenuQueryDto,
  MenuResponseDto,
} from './dto/menu.request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // 인증 가드
import {
  ApiListResponse,
  ApiDetailResponse,
  ApiCreateResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from 'common/decorators/api-response.decorator';

@ApiTags('메뉴 관리')
@Controller('menus')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({
    summary: '메뉴 생성',
    description: '새로운 메뉴를 생성합니다.',
  })
  @ApiCreateResponse()
  async create(@Body(ValidationPipe) createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto, 'system'); // userId 대신 임시로 'system' 사용
  }

  @Get()
  @ApiOperation({
    summary: '메뉴 목록 조회',
    description: '조건에 따른 메뉴 목록을 조회합니다.',
  })
  @ApiListResponse()
  async findAll(@Query(ValidationPipe) query: MenuQueryDto) {
    return this.menuService.findAll(query);
  }

  @Get('tree')
  @ApiOperation({
    summary: '메뉴 트리 조회',
    description: '계층 구조로 구성된 전체 메뉴 트리를 조회합니다.',
  })
  @ApiListResponse()
  async findMenuTree(@Query(ValidationPipe) query: MenuQueryDto) {
    return this.menuService.findMenuTree(query);
  }

  // @Get('user-menus')
  // @ApiOperation({
  //   summary: '사용자 메뉴 조회',
  //   description: '현재 사용자가 접근 가능한 메뉴를 조회합니다.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: '사용자 메뉴가 성공적으로 조회되었습니다.',
  //   type: [MenuResponseDto],
  // })
  // async findUserMenus() // @CurrentUser('id') userId: string,
  // // @CurrentUser('roles') roles: string[],
  // : Promise<MenuResponseDto[]> {
  //   // return this.menuService.findUserMenus(userId, roles);
  //   return this.menuService.findUserMenus('test-user', ['ADMIN']); // 임시 데이터
  // }

  @Get(':id')
  @ApiOperation({
    summary: '메뉴 상세 조회',
    description: '특정 메뉴의 상세 정보를 조회합니다.',
  })
  @ApiDetailResponse()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '메뉴 수정',
    description: '기존 메뉴 정보를 수정합니다.',
  })
  @ApiUpdateResponse('게시글 수정 완료', true)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, updateMenuDto, 'system'); // userId 대신 임시로 'system' 사용
  }

  @Delete(':id')
  @ApiOperation({ summary: '메뉴 삭제', description: '메뉴를 삭제합니다.' })
  @ApiDeleteResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.menuService.remove(id);
  }

  @Patch('reorder')
  @ApiOperation({
    summary: '메뉴 순서 변경',
    description: '메뉴들의 정렬 순서를 변경합니다.',
  })
  @ApiUpdateResponse('게시글 수정 완료', true)
  async reorderMenus(
    @Body('menuIds') menuIds: number[],
  ): Promise<{ message: string }> {
    await this.menuService.reorderMenus(menuIds);
    return { message: '메뉴 순서가 성공적으로 변경되었습니다.' };
  }

  @Get(':id/children')
  @ApiOperation({
    summary: '자식 메뉴 조회',
    description: '특정 메뉴의 직계 자식 메뉴들을 조회합니다.',
  })
  @ApiListResponse()
  async findChildren(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MenuResponseDto[]> {
    return this.menuService.findAll({ parentId: id });
  }

  @Get('level/:level')
  @ApiOperation({
    summary: '레벨별 메뉴 조회',
    description: '특정 레벨의 메뉴들을 조회합니다.',
  })
  @ApiListResponse()
  async findByLevel(
    @Param('level', ParseIntPipe) level: number,
  ): Promise<MenuResponseDto[]> {
    return this.menuService.findAll({ level });
  }
}
