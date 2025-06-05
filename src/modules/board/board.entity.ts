import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '시퀀스' })
  id: number;

  @Column({ nullable: false, comment: '제목' })
  title: string;

  @Column({ nullable: false, comment: '내용' })
  content: string;
}
