# 빌드 단계
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm ci
COPY . .
# 개발 환경 빌드 (.env.developer 파일을 사용)
RUN npm run build

# 실행 단계
FROM node:22-alpine
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# 개발 환경 기본 변수 설정
ENV NODE_ENV=development
ENV PORT=3001

EXPOSE 3001
# 개발 환경용 시작 명령어
CMD ["node", "dist/main.js"]