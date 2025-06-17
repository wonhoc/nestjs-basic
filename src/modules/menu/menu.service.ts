import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository, IsNull } from 'typeorm';
import { Menu } from './menu.entity';
import {
  CreateMenuDto,
  UpdateMenuDto,
  MenuQueryDto,
  MenuResponseDto,
} from './dto/menu.request.dto';
import { Transactional } from 'typeorm-transactional';
import { CustomApiException } from 'src/common/exceptions/custom-api.exception';
import { ErrorCode } from 'src/common/exceptions/errorCode.type';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // 메뉴 생성
  @Transactional()
  async create(
    createMenuDto: CreateMenuDto,
    userId?: string,
  ): Promise<MenuResponseDto> {
    // 부모 메뉴 검증
    if (createMenuDto.parentId) {
      const parentMenu = await this.menuRepository.findOne({
        where: { id: createMenuDto.parentId },
      });
      if (!parentMenu) {
        throw new NotFoundException(
          `부모 메뉴를 찾을 수 없습니다. ID: ${createMenuDto.parentId}`,
        );
      }

      // 레벨 자동 계산
      createMenuDto.level = parentMenu.level + 1;
    }

    const menuData: Partial<Menu> = {
      name: createMenuDto.name,
      description: createMenuDto.description,
      url: createMenuDto.url,
      icon: createMenuDto.icon,
      parentId: createMenuDto.parentId || null,
      sortOrder: createMenuDto.sortOrder,
      level: createMenuDto.level,
      isActive: createMenuDto.isActive,
      isVisible: createMenuDto.isVisible,
      type: createMenuDto.type,
      permission: createMenuDto.permission,
      config: createMenuDto.config,
      createdBy: userId,
      updatedBy: userId,
    };

    const menu = this.menuRepository.create(menuData);
    const savedMenu = await this.menuRepository.save(menu);
    return this.mapToResponseDto(savedMenu);
  }

  // 전체 메뉴 목록 조회 (계층 구조)
  async findAll(query: MenuQueryDto): Promise<MenuResponseDto[]> {
    const queryBuilder = this.menuRepository.createQueryBuilder('menu');

    queryBuilder.andWhere('menu.deleted = :deleted', {
      deleted: false,
    });

    // 조건 필터링
    if (query.parentId !== undefined) {
      if (query.parentId === null) {
        queryBuilder.andWhere('menu.parentId IS NULL');
      } else {
        queryBuilder.andWhere('menu.parentId = :parentId', {
          parentId: query.parentId,
        });
      }
    }

    if (query.level !== undefined) {
      queryBuilder.andWhere('menu.level = :level', { level: query.level });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('menu.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    if (query.isVisible !== undefined) {
      queryBuilder.andWhere('menu.isVisible = :isVisible', {
        isVisible: query.isVisible,
      });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(menu.name LIKE :search OR menu.description LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // 정렬
    queryBuilder.orderBy('menu.sortOrder', 'ASC');
    queryBuilder.addOrderBy('menu.id', 'ASC');

    const menus = await queryBuilder.getMany();
    return menus.map((menu) => this.mapToResponseDto(menu));
  }

  // 계층 구조로 메뉴 트리 조회
  async findMenuTree(query: MenuQueryDto = {}): Promise<MenuResponseDto[]> {
    // 루트 메뉴들 조회
    const rootMenus = await this.findAll({ ...query, parentId: null });

    // 각 루트 메뉴의 자식들을 재귀적으로 로드
    for (const rootMenu of rootMenus) {
      await this.loadChildren(rootMenu);
    }

    return rootMenus;
  }

  // 자식 메뉴 재귀 로드
  private async loadChildren(menu: MenuResponseDto): Promise<void> {
    const children = await this.findAll({ parentId: menu.id });
    menu.children = children;
    menu.hasChildren = children.length > 0;

    // 재귀적으로 자식의 자식들도 로드
    for (const child of children) {
      await this.loadChildren(child);
    }
  }

  // 특정 메뉴 조회
  async findOne(id: number): Promise<MenuResponseDto> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!menu) {
      throw new CustomApiException(ErrorCode.MENU_FIND_ERROR);
    }

    return this.mapToResponseDto(menu);
  }

  // 메뉴 수정
  @Transactional()
  async update(
    id: number,
    updateMenuDto: UpdateMenuDto,
    userId?: string,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuRepository.findOne({ where: { id } });

    if (!menu) {
      throw new CustomApiException(ErrorCode.MENU_FIND_ERROR);
    }

    // 부모 메뉴 변경 시 검증
    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId === id) {
        throw new CustomApiException(ErrorCode.MENU_CRETE_BY_SELF);
      }

      if (updateMenuDto.parentId) {
        const parentMenu = await this.menuRepository.findOne({
          where: { id: updateMenuDto.parentId },
        });
        if (!parentMenu) {
          throw new CustomApiException(ErrorCode.MENU_FIND_ERROR);
        }

        // 순환 참조 검사
        if (await this.hasCircularReference(id, updateMenuDto.parentId)) {
          throw new CustomApiException(ErrorCode.MENU_CYCLE_ERROR);
        }

        // 레벨 자동 계산
        updateMenuDto.level = parentMenu.level + 1;
      } else {
        updateMenuDto.level = 1;
      }
    }

    Object.assign(menu, updateMenuDto);

    const savedMenu = await this.menuRepository.save(menu);
    return this.mapToResponseDto(savedMenu);
  }

  // 메뉴 삭제
  @Transactional()
  async remove(id: number): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!menu) {
      throw new CustomApiException(ErrorCode.MENU_FIND_ERROR);
    }

    // 하위 메뉴들을 재귀적으로 삭제
    if (menu.children && menu.children.length > 0) {
      for (const child of menu.children) {
        await this.remove(child.id); // 재귀 호출
      }
    }

    await this.menuRepository.update(id, { deleted: true });
  }

  // 메뉴 순서 변경
  @Transactional()
  async reorderMenus(menuIds: number[]): Promise<void> {
    for (let i = 0; i < menuIds.length; i++) {
      await this.menuRepository.update(menuIds[i], { sortOrder: i + 1 });
    }
  }

  // 특정 사용자의 접근 가능한 메뉴 조회 (권한 기반)
  async findUserMenus(
    userId: string,
    roleIds: string[],
  ): Promise<MenuResponseDto[]> {
    const queryBuilder = this.menuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu_permission', 'mp', 'mp.menuId = menu.id')
      .where('menu.isActive = true')
      .andWhere('menu.isVisible = true')
      .andWhere('(mp.roleId IN (:...roleIds) AND mp.canRead = true)', {
        roleIds,
      })
      .orderBy('menu.level', 'ASC')
      .addOrderBy('menu.sortOrder', 'ASC');

    const menus = await queryBuilder.getMany();

    // 중복 제거 및 계층 구조 구성
    const uniqueMenus = menus.filter(
      (menu, index, self) => index === self.findIndex((m) => m.id === menu.id),
    );

    return this.buildMenuTree(uniqueMenus);
  }

  // 순환 참조 검사
  private async hasCircularReference(
    menuId: number,
    parentId: number,
  ): Promise<boolean> {
    let currentParentId: number | null | undefined = parentId;

    while (currentParentId) {
      if (currentParentId === menuId) {
        return true;
      }

      const parent = await this.menuRepository.findOne({
        where: { id: currentParentId },
        select: ['parentId'],
      });

      currentParentId = parent?.parentId;
    }

    return false;
  }

  // 메뉴 배열을 트리 구조로 변환
  private buildMenuTree(menus: Menu[]): MenuResponseDto[] {
    const menuMap = new Map<number, MenuResponseDto>();
    const rootMenus: MenuResponseDto[] = [];

    // 먼저 모든 메뉴를 Map에 저장
    menus.forEach((menu) => {
      const menuDto = this.mapToResponseDto(menu);
      menuDto.children = [];
      menuMap.set(menu.id, menuDto);
    });

    // 부모-자식 관계 설정
    menus.forEach((menu) => {
      const menuDto = menuMap.get(menu.id);
      if (!menuDto) return; // menuDto가 없으면 스킵

      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(menuDto); // 이제 안전
          parent.hasChildren = true;
        }
      } else {
        rootMenus.push(menuDto); // 이것도 안전
      }
    });

    return rootMenus;
  }

  // Entity를 ResponseDto로 변환
  private mapToResponseDto(menu: Menu): MenuResponseDto {
    return {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      url: menu.url,
      icon: menu.icon,
      parentId: menu.parentId,
      sortOrder: menu.sortOrder,
      level: menu.level,
      isActive: menu.isActive,
      isVisible: menu.isVisible,
      type: menu.type,
      permission: menu.permission,
      config: menu.config,
      createdDtm: menu.createdDtm,
      updatedDtm: menu.updatedDtm,
      createdBy: menu.createdBy,
      updatedBy: menu.updatedBy,
      children: [],
      hasChildren: menu.children ? menu.children.length > 0 : false,
    };
  }
}
