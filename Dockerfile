FROM node:24-bookworm-slim AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/domain/package.json packages/domain/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages/contracts packages/contracts
COPY packages/domain packages/domain

RUN pnpm --filter @say-it-first/contracts build \
  && pnpm --filter @say-it-first/domain build \
  && pnpm --filter @say-it-first/api build \
  && pnpm --filter @say-it-first/api deploy --prod --legacy /opt/say-it-first-api \
  && rm -rf /opt/say-it-first-api/node_modules/@say-it-first/contracts \
    /opt/say-it-first-api/node_modules/@say-it-first/domain \
  && cp -R packages/contracts /opt/say-it-first-api/node_modules/@say-it-first/contracts \
  && cp -R packages/domain /opt/say-it-first-api/node_modules/@say-it-first/domain

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV APP_ENV=production
ENV API_HOST=0.0.0.0
ENV API_PORT=8080
ENV LOG_LEVEL=info
ENV LOG_PRETTY=false

WORKDIR /app

COPY --from=build --chown=node:node /opt/say-it-first-api ./

USER node

EXPOSE 8080

CMD ["node", "dist/server.js"]
