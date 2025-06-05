import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '',
  })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  password: string;
}

export class GetUserByEmailDto {
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;
}

export class RegisterUserReqDto {
  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsString({ message: '사용자 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '사용자 이름을 입력해주세요.' })
  @MinLength(2, { message: '사용자 이름은 최소 2자 이상이어야 합니다.' })
  username: string;

  @ApiProperty({
    description: '비밀번호',
    example: '',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({
    description: '비밀번호 확인',
    example: '',
  })
  @IsString({ message: '비밀번호 확인은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  passwordConfirm: string;
}
