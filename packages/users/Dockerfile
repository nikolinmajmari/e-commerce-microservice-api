FROM node:16-alpine3.15 AS BUILD_IMAGE
WORKDIR /usr/src/app
COPY ../../package.json .
COPY ../../package-lock.json .
COPY ../../dist/packages/users .
RUN npm install --production
EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["/usr/src/app/main.js"]
