FROM docker.io/node:18.15-bullseye AS build
WORKDIR /app

COPY package.json .
COPY . .
RUN npm install --development
RUN npm run build -- api --prod

FROM docker.io/node:18.15-bullseye AS final

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup --system api && \
  adduser --system -G api api

COPY --from=build /app/dist/apps/api api
RUN chown -R api:api .
RUN npm install --production

EXPOSE ${PORT}

CMD [ "node", "main.js" ]
