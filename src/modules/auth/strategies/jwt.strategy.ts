import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { CustomApiException } from 'src/common/exceptions/custom-api.exception';
import { ErrorCode } from 'src/common/exceptions/errorCode.type';
import { ConfigService } from '@nestjs/config';

// 인가 시 필요
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      throw new CustomApiException(ErrorCode.USER_IS_NOT_FOUND);
    }
    return { userId: payload.sub, email: payload.email };
  }
}
