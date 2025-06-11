export class PaginatedResponseDto<T> {
  // T는 실제 데이터 타입을 나타냅니다 (Board, User, Product 등)
  items: T[]; // 실제 조회된 데이터 배열

  pagination: {
    currentPage: number; // 현재 페이지 번호
    totalPages: number; // 전체 페이지 수
    totalItems: number; // 전체 아이템 수 (total)
    itemsPerPage: number; // 페이지당 아이템 수 (limit)
    hasNext: boolean; // 다음 페이지 존재 여부
    hasPrevious: boolean; // 이전 페이지 존재 여부
    startItem: number; // 현재 페이지의 시작 아이템 번호
    endItem: number; // 현재 페이지의 끝 아이템 번호
  };

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;

    // 1. 전체 페이지 수 계산
    const totalPages = Math.ceil(total / limit);

    // 2. 시작/끝 아이템 번호 계산
    const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    // 3. 모든 페이징 정보 설정
    this.pagination = {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext: page < totalPages, // 핵심 로직!
      hasPrevious: page > 1, // 핵심 로직!
      startItem,
      endItem,
    };
  }
}
