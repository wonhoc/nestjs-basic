import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CustomApiException } from 'src/common/exceptions/custom-api.exception';
import { ErrorCode } from 'src/common/exceptions/errorCode.type';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RegisterUserReqDto } from './dto/user.request.dto';
import { GetUserResponseDto } from './dto/user.response.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // id로 회원 찾기
  async findOneById(id: number): Promise<GetUserResponseDto> {
    const user: User | null = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new CustomApiException(ErrorCode.USER_IS_NOT_FOUND);
    }

    return user;
  }

  // EMAIL로 회원 찾기
  async findOneByEmail(email: string): Promise<GetUserResponseDto> {
    const user: User | null = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new CustomApiException(ErrorCode.USER_IS_NOT_FOUND_BY_EMAIL);
    }

    return plainToClass(GetUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  // 회원가입
  @Transactional()
  async saveUser(registerUserReqDto: RegisterUserReqDto) {
    const user: User | null = await this.usersRepository.findOne({
      where: { email: registerUserReqDto.email },
    });

    if (user != null) {
      throw new CustomApiException(ErrorCode.USER_IS_ALREADY_EXIST);
    }

    await this.usersRepository.save({
      email: registerUserReqDto.email,
      password: registerUserReqDto.password,
      username: registerUserReqDto.username,
    });
  }

  // updateRefreshToken
  @Transactional()
  async updateRefreshToken(id: number, refreshToken: string) {
    const user: User | null = await this.usersRepository.findOneBy({ id });

    if (user == null) throw new CustomApiException(ErrorCode.USER_IS_NOT_FOUND);

    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
  }
}
