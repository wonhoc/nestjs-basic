import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CommonSearchDto {
  @ApiPropertyOptional({
    description: '검색어',
    example: '',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: '현재 페이지 넘버',
    example: '',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: '페이지 제안',
    example: '',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
