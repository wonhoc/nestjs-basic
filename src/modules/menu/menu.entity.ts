import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity('menu')
@Index(['parentId', 'sortOrder']) // 부모별 정렬 순서 인덱스
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '시퀀스' })
  id: number;

  @Column({ length: 100, comment: '메뉴명' })
  name: string;

  @Column({ length: 200, nullable: true, comment: '메뉴 설명' })
  description: string;

  @Column({ length: 255, nullable: true, comment: '메뉴 URL/경로' })
  url: string;

  @Column({ length: 50, nullable: true, comment: '아이콘 클래스/이름' })
  icon: string;

  @Column({ type: 'int', nullable: true, comment: '부모 메뉴 ID' })
  parentId: number | null;

  @Column({ type: 'int', default: 0, comment: '정렬 순서' })
  sortOrder: number;

  @Column({ type: 'int', default: 1, comment: '메뉴 레벨 (1: 최상위)' })
  level: number;

  @Column({ default: true, comment: '활성화 여부' })
  isActive: boolean;

  @Column({ default: true, comment: '표시 여부' })
  isVisible: boolean;

  @Column({
    length: 50,
    nullable: true,
    comment: '메뉴 타입 (menu, button, link 등)',
  })
  type: string;

  @Column({ length: 100, nullable: true, comment: '권한 코드' })
  permission: string;

  @Column({ type: 'text', nullable: true, comment: '추가 설정 (JSON)' })
  config: string;

  // 부모 메뉴와의 관계
  @ManyToOne(() => Menu, (menu) => menu.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Menu;

  // 자식 메뉴들과의 관계
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  // 계산된 속성들 (Getter)
  get hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  get fullPath(): string {
    // 부모 경로 + 현재 경로 조합
    if (this.parent && this.parent.url) {
      return `${this.parent.fullPath}/${this.url}`.replace(/\/+/g, '/');
    }
    return this.url || '';
  }
}
