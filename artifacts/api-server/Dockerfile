FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY ../../pnpm-workspace.yaml ../../package.json ../../pnpm-lock.yaml ./
COPY ../../lib ./lib
COPY . ./artifacts/api-server
RUN pnpm install --filter @workspace/api-server...
WORKDIR /app/artifacts/api-server
RUN pnpm run build
EXPOSE 3000
CMD ["node", "./dist/index.mjs"]
