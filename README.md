# NestJS 프로젝트

NestJS 프레임워크를 사용한 백엔드 API 서버입니다.

## 📋 목차

- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [설치 방법](#설치-방법)
- [실행 방법](#실행-방법)
- [API 문서](#api-문서)
- [환경 설정](#환경-설정)

## 🚀 프로젝트 소개

이 프로젝트는 NestJS를 사용하여 구축된 RESTful API 서버입니다. TypeScript 기반으로 개발되었으며, 모듈러 아키텍처를 통해 확장 가능하고 유지보수가 용이한 구조로 설계되었습니다.

## 🛠 기술 스택

- **프레임워크**: NestJS
- **언어**: TypeScript
- **데이터베이스**: Mysql
- **ORM**: TypeORM
- **인증**: JWT
- **문서화**: Swagger

## 📦 설치 방법

### 필수 요구사항

- Node.js (v18 이상)
- npm 또는 yarn
- PostgreSQL (또는 사용하는 DB)

### 프로젝트 클론 및 의존성 설치

```bash
# 의존성 설치
npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

```

## 🚀 실행 방법

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NODE_ENV=development
PORT=3001

DB_TYPE=db_type(mysql)
DB_HOST=db_url
DB_PORT=your_db_port
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
DB_SYNC=true

# 기타 설정
API_PREFIX=api 기본 path
CORS_ORIGIN=http://localhost:3000,http://localhost:3010

# JWT 설정
JWT_SECRET=시크릿
JWT_REFRESH_SECRET=refresh token에 대한 시크릿
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 개발 서버 실행

```bash
# 개발 모드
npm run start:dev
# 또는
yarn start:dev

# 일반 실행
npm run start
# 또는
yarn start

# 프로덕션 모드
npm run start:prod
# 또는
yarn start:prod
```

서버가 정상적으로 실행되면 `http://localhost:3000`에서 접근할 수 있습니다.

## 📖 API 문서

API 문서는 Swagger를 통해 제공됩니다.

- **개발 환경**: `http://localhost:3000/api/docs`
- **프로덕션 환경**: `https://your-domain.com/api/docs`

## ⚙️ 환경 설정

### 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성
npm run migration:generate -- --name=MigrationName

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert
```
