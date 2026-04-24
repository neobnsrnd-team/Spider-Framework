# Dockerfile
# ──────────────────────────────────────────────────────────────────────────────
# Multi-stage 빌드 — Node.js 20 + Oracle Instant Client (Thick 모드)
#
# [빌드 방법]
#   docker build -t springware-cms .
#
# [Oracle Instant Client URL 변경 시]
#   docker build --build-arg OIC_URL=<새_URL> --build-arg OIC_DIR=<디렉토리명> -t springware-cms .
#   최신 URL: https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Next.js 빌드 ─────────────────────────────────────────────────────
# standalone 빌드가 필요한 node_modules를 자체 포함하므로 별도 deps 스테이지 불필요
FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
# 빌드 도구(devDependencies 포함) 전체 설치
RUN npm ci

COPY . .

# standalone 모드 빌드 → .next/standalone/server.js + 필요한 node_modules 생성
RUN npm run build


# ── Stage 2: 운영 이미지 ──────────────────────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

# Oracle Instant Client 다운로드 URL 및 압축 해제 후 디렉토리명
# ※ 버전 업그레이드 시 두 ARG를 함께 변경해야 합니다
ARG OIC_URL=https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-basiclite-linux.x64-23.8.0.25.04.zip
ARG OIC_DIR=instantclient_23_8

# Oracle Instant Client 설치 (oracledb Thick 모드 동작에 필수)
RUN apt-get update && apt-get install -y --no-install-recommends \
      libaio1 wget unzip ca-certificates && \
    mkdir -p /opt/oracle && \
    wget -q -O /tmp/oracle-ic.zip "${OIC_URL}" && \
    unzip /tmp/oracle-ic.zip -d /opt/oracle && \
    rm /tmp/oracle-ic.zip && \
    echo "/opt/oracle/${OIC_DIR}" > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig && \
    # 빌드에만 필요한 패키지 제거
    apt-get purge -y wget unzip && \
    apt-get autoremove -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
# PORT는 docker-compose에서 주입 (관리자: 3000, 운영: 3001)

# 비root 사용자로 실행 (보안)
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

# standalone 빌드 결과물 복사
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# oracledb 네이티브 바이너리 복사 (standalone 빌드가 .node 파일을 누락하므로 원본 덮어쓰기)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/oracledb ./node_modules/oracledb

# public 에셋 복사 (plugins, scripts, fonts, runtime 등)
# public/uploads, public/deployed 는 .dockerignore로 제외됨 → 볼륨 마운트로 처리
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 볼륨 마운트 포인트 사전 생성 및 권한 설정
RUN mkdir -p public/uploads public/deployed && \
    chown -R nextjs:nodejs public/uploads public/deployed

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
