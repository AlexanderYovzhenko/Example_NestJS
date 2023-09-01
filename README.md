<h1 align="center">Example_NestJS_Backend</h1>

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description
<h3>API for example - NestJS microservices (TypeScript, Node.js, Nest.js, Postgres, Sequelize, RabbitMQ, Docker, JWT, Telegram Bot, Nanoid, Argon2, Jest and others)</h3>

</br>

## Documentation for endpoints
<h3>Home <a href="http://localhost:8080/" target="blank">localhost:8080</a> - home page, check if the server is running</h3>
<h3>Docs <a href="http://localhost:8080/api/docs" target="blank">localhost:8080/api/docs</a> - detailed documentation</h3>

</br>

## PgAdmin and RabbitMQ managers
<h3>PgAdmin <a href="http://localhost:15432/" target="blank">localhost:15432</a> - Postgres Admin</h3>
<h3>RabbitMQ <a href="http://localhost:15672/" target="blank">localhost:15672</a> - rabbitMQ manager</h3>

</br>

## Rename .env.example to .env file

```bash
.env.example to .env 

```

```bash
check variables of .env file TELEGRAM_BOT_LINK, PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD and others
```

## Installation

```bash
$ npm install

# or

$ npm ci
```

## Running the app in docker

```bash
# docker
$ docker compose up --build

```

## Test

```bash
# unit tests
$ npm run test

# unit tests detail
$ npm run test:detail

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
