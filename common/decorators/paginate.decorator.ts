import { SelectQueryBuilder } from 'typeorm';
import { PaginatedResponseDto } from 'src/common/dto/response.dto';

/**
 * @Paginate 데코레이터
 * QueryBuilder를 반환하는 메소드에 적용하면 자동으로 페이징 처리
 */
export function Paginate() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    console.log(originalMethod);

    descriptor.value = async function (...args: any[]) {
      // 마지막 인자에서 페이징 정보 추출
      const lastArg = args[args.length - 1];
      let page = 1;
      let limit = 10;

      if (
        lastArg &&
        typeof lastArg === 'object' &&
        ('page' in lastArg || 'limit' in lastArg)
      ) {
        page = Number(lastArg.page) || 1;
        limit = Number(lastArg.limit) || 10;
      }

      // 원본 메소드 실행해서 QueryBuilder 받기
      const queryBuilder: SelectQueryBuilder<any> = await originalMethod.apply(
        this,
        args,
      );

      // QueryBuilder에 페이징 적용하고 실행
      const [data, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return new PaginatedResponseDto(data, total, page, limit);
    };

    return descriptor;
  };
}
