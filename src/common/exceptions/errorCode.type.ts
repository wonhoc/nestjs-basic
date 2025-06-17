export interface ErrorCodeInfo {
  code: string;
  message: string;
  httpStatus?: number; // HTTP 상태 코드 추가
}

export const ErrorCode = {
  // 공통 에러 (500)
  COMM_INTERNAL_SERVER_ERROR: {
    code: 'ERROR-COMM-E001',
    message: '서버 내부 오류가 발생했습니다.',
    httpStatus: 500,
  },
  COMM_UNKNOWN_ERROR: {
    code: 'ERROR-COMM-E002',
    message: '서버 내부 오류가 발생했습니다.',
    httpStatus: 500,
  },
  COMM_FIND_ERROR: {
    code: 'ERROR-COMM-E003',
    message: '데이터를 찾을 수 없습니다.',
    httpStatus: 500,
  },

  // 메뉴 관련 에려
  MENU_FIND_ERROR: {
    code: 'ERROR-MENU-E001',
    message: '데이터를 찾을 수 없습니다.',
    httpStatus: 500,
  },
  MENU_CRETE_BY_SELF: {
    code: 'ERROR-MENU-E002',
    message: '자기 자신을 부모로 설정할 수 없습니다.',
    httpStatus: 500,
  },
  MENU_CYCLE_ERROR: {
    code: 'ERROR-MENU-E003',
    message: '순환 참조가 발생합니다.',
    httpStatus: 500,
  },

  // 사용자 관련 에러 (400, 401, 404)
  USER_IS_NOT_FOUND: {
    code: 'ERROR-USER-E001',
    message: '사용자를 찾을 수 없습니다.',
    httpStatus: 404,
  },
  USER_IS_NOT_FOUND_BY_EMAIL: {
    code: 'ERROR-USER-E002',
    message: 'email을 찾을 수 없습니다.',
    httpStatus: 404,
  },
  USERS_IS_NOT_FOUND_BY_TOKEN: {
    code: 'ERROR-USER-E003',
    message: '토큰을 찾을 수 없습니다.',
    httpStatus: 401,
  },
  USER_IS_INVALID_PASSWORD: {
    code: 'ERROR-USER-E004',
    message: '패스워드가 일치하지 않습니다.',
    httpStatus: 400,
  },
  USER_IS_LOCKED: {
    code: 'ERROR-USER-E005',
    message: '사용자 계정이 잠겨있습니다.',
    httpStatus: 403,
  },
  USER_IS_DISABLED: {
    code: 'ERROR-USER-E006',
    message: '사용자 계정을 사용할 수 없습니다.',
    httpStatus: 403,
  },
  USER_ACCOUNT_EXPIRYDATE_IS_EXPIRED: {
    code: 'ERROR-USER-E007',
    message: '사용자 계정이 만료되었습니다.',
    httpStatus: 403,
  },
  USER_PASSWORD_IS_EXPIRED: {
    code: 'ERROR-USER-E008',
    message: '계정의 패스워드가 만료되었습니다.',
    httpStatus: 403,
  },
  USER_IS_LOGINED_DUPLICATE: {
    code: 'ERROR-USER-E009',
    message: '사용자 계정 세션이 중복되었습니다.',
    httpStatus: 409,
  },
  USER_IS_ALREADY_EXIST: {
    code: 'ERROR-USER-E010',
    message: '이메일이 이미 존재합니다.',
    httpStatus: 403,
  },

  // JWT 관련 에러 (401)
  JWT_IS_NOT_VALID: {
    code: 'ERROR-JWT-E001',
    message: '유효한 토큰 형식이 아닙니다',
    httpStatus: 401,
  },
  JWT_IS_MALFORMED: {
    code: 'ERROR-JWT-E002',
    message: '손상된 토큰입니다.',
    httpStatus: 401,
  },
  JWT_DECODING_IS_FAILED: {
    code: 'ERROR-JWT-E003',
    message: '토큰 디코딩에 실패했습니다.',
    httpStatus: 401,
  },
  JWT_IS_EXPIRED: {
    code: 'ERROR-JWT-E004',
    message: '만료된 토큰입니다. 재로그인 부탁드립니다.',
    httpStatus: 401,
  },
} as const;

export type ErrorCodeType = keyof typeof ErrorCode;
