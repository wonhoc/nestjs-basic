import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '시퀀스' })
  id: number;

  @Column({ nullable: false, comment: '사용자 이름' })
  username: string;

  @Column({ nullable: false, comment: '패스워드' })
  password: string;

  @Column({ nullable: false, comment: '이메일 주소' })
  email: string;

  @Column({ nullable: true })
  refreshToken: string;
}
