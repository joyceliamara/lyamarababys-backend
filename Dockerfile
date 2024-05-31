FROM node:21-alpine as build

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

FROM node:21-alpine as production

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/yarn.lock .
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/lyamarababys

RUN yarn install --production
RUN yarn prisma migrate deploy
RUN yarn prisma generate

EXPOSE 3001

CMD ["node", "dist/main.js"]

# docker build -t lyamarababys-backend:latest .
# docker run -p 3001:3001 lyamarababys-backend:latest
