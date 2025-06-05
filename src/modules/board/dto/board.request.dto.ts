import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class SearchBoardsDto {
  @ApiProperty({
    description: '검색어',
    example: '',
  })
  @IsOptional() // 필수 추가!
  @IsString() // 필수 추가!
  keyword?: string;
}

export class CreateBoardDto {
  @ApiProperty({
    description: '게시글의 제목',
    example: '제목1',
  })
  @MinLength(2, { message: '최소 1자 이상 입력해주세요' })
  @MaxLength(30, { message: '최대 30자까지 입력 가능합니다.' })
  title: string;

  @ApiProperty({
    description: '게시글의 내용',
    example: '내용1',
  })
  @MinLength(2, { message: '최소 1자 이상 입력해주세요' })
  @MaxLength(500, { message: '최대 500자까지 입력 가능합니다.' })
  content: string;
}

export class UpdateBoardDto {
  @ApiProperty({
    description: '게시글의 ID',
    example: '1',
  })
  @IsNotEmpty({ message: '게시글의 아이디가 없습니다.' })
  id: number;

  @ApiProperty({
    description: '게시글의 제목',
    example: '제목1',
  })
  @MinLength(2, { message: '최소 1자 이상 입력해주세요' })
  @MaxLength(30, { message: '최대 30자까지 입력 가능합니다.' })
  title: string;

  @ApiProperty({
    description: '게시글의 내용',
    example: '내용1',
  })
  @MinLength(2, { message: '최소 1자 이상 입력해주세요' })
  @MaxLength(500, { message: '최대 500자까지 입력 가능합니다.' })
  content: string;
}
