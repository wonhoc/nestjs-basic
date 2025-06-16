import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUrl,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateMenuDto {
  @ApiProperty({ description: '메뉴명', example: '사용자 관리' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    description: '메뉴 설명',
    example: '사용자 정보를 관리합니다',
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @ApiPropertyOptional({ description: '메뉴 URL', example: '/users' })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  url?: string;

  @ApiPropertyOptional({ description: '아이콘', example: 'users' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  icon?: string;

  @ApiPropertyOptional({
    description: '부모 메뉴 ID (null: 최상위 메뉴)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentId?: number | null;

  @ApiProperty({ description: '정렬 순서', example: 1, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder: number = 0;

  @ApiProperty({ description: '메뉴 레벨', example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  level: number = 1;

  @ApiProperty({ description: '활성화 여부', example: true, default: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive: boolean = true;

  @ApiProperty({ description: '표시 여부', example: true, default: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isVisible: boolean = true;

  @ApiPropertyOptional({ description: '메뉴 타입', example: 'menu' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  type?: string;

  @ApiPropertyOptional({ description: '권한 코드', example: 'MENU_USER_MGMT' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  permission?: string;

  @ApiPropertyOptional({
    description: '추가 설정 (JSON)',
    example: '{"target": "_blank"}',
  })
  @IsOptional()
  @IsString()
  config?: string;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

export class MenuQueryDto {
  @ApiPropertyOptional({
    description: '부모 메뉴 ID (null: 최상위 메뉴)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null;

  @ApiPropertyOptional({ description: '메뉴 레벨', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  level?: number;

  @ApiPropertyOptional({ description: '활성화 상태', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '표시 상태', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: '검색어', example: '사용자' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class MenuResponseDto {
  @ApiProperty({ description: '메뉴 ID' })
  id: number;

  @ApiProperty({ description: '메뉴명' })
  name: string;

  @ApiPropertyOptional({ description: '메뉴 설명' })
  description?: string;

  @ApiPropertyOptional({ description: '메뉴 URL' })
  url?: string;

  @ApiPropertyOptional({ description: '아이콘' })
  icon?: string;

  @ApiPropertyOptional({ description: '부모 메뉴 ID (null: 최상위 메뉴)' })
  parentId?: number | null;

  @ApiProperty({ description: '정렬 순서' })
  sortOrder: number;

  @ApiProperty({ description: '메뉴 레벨' })
  level: number;

  @ApiProperty({ description: '활성화 여부' })
  isActive: boolean;

  @ApiProperty({ description: '표시 여부' })
  isVisible: boolean;

  @ApiPropertyOptional({ description: '메뉴 타입' })
  type?: string;

  @ApiPropertyOptional({ description: '권한 코드' })
  permission?: string;

  @ApiPropertyOptional({ description: '추가 설정' })
  config?: string;

  @ApiProperty({ description: '생성일시' })
  createdDtm: Date;

  @ApiProperty({ description: '수정일시' })
  updatedDtm: Date;

  @ApiPropertyOptional({ description: '생성자' })
  createdBy?: string;

  @ApiPropertyOptional({ description: '수정자' })
  updatedBy?: string;

  @ApiPropertyOptional({
    description: '자식 메뉴 목록',
    type: [MenuResponseDto],
  })
  children?: MenuResponseDto[];

  @ApiProperty({ description: '자식 메뉴 존재 여부' })
  hasChildren: boolean;
}
