import { Exclude, Expose } from 'class-transformer';

export class GetUserResponseDto {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  password: string;
  @Expose()
  email: string;
  @Expose()
  refreshToken: string;
}
