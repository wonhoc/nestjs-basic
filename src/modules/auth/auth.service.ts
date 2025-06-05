import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserReqDto } from '../user/dto/user.request.dto';
import { CustomApiException } from 'src/common/exceptions/custom-api.exception';
import { ErrorCode } from 'src/common/exceptions/errorCode.type';
import { LoginDto } from '../user/dto/user.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;

      return result;
    } else {
      throw new CustomApiException(ErrorCode.USER_IS_NOT_FOUND);
    }
  }

  // 로그인
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Refresh token을 데이터베이스에 저장
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    console.log(user);

    return {
      id: user.id,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // 회원가입
  async register(registerUserReqDto: RegisterUserReqDto) {
    registerUserReqDto.password = await bcrypt.hash(
      registerUserReqDto.password,
      10,
    );

    await this.usersService.saveUser(registerUserReqDto);
  }

  // refreshToken 재발급
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOneById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new CustomApiException(ErrorCode.JWT_IS_NOT_VALID);
      }

      const newPayload = { email: user.email, sub: user.id };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      });

      await this.usersService.updateRefreshToken(user.id, newRefreshToken);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new CustomApiException(ErrorCode.JWT_IS_NOT_VALID);
    }
  }
}
