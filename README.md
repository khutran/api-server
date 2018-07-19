# Reflaunt

* [Requirement](#requirement)
* [Installation](#installation)
* [Run Development Server](#development)
* [Run Development Server Using Dockker](#development-docker)
* [Run Production Server](#production)
* [Coding Convention](#coding-convention)
* [Command](#command)

<a name="requirement"></a>

## Requirement

Make sure all dependencies have been installed before moving on

* [Nodejs](https://nodejs.org/en/) >= 8.0.x
* [npm](https://www.npmjs.com/) >= 5.0.x
* [Yarn](https://yarnpkg.com/) >= 0.27.5
* [Redis](https://redis.io/) >= 4.0
* [MySQL](https://www.mysql.com/) >= 5.7 (MySQL or PostgreSQL)
* [PostgreSQL](https://www.postgresql.org/) >= 10.0 (MySQL or PostgreSQL)

<a name="installation"></a>

## Installation

#### Clone repository

```
git clone https://bitbucket.org/vicoderscom/viwebsite_server_api.git
```

#### Install packgages

```shell
yarn install
```

#### Configuration

make `.env` file is a copy of `.env.example` and update it with your information

#### Migrate database

```
./node_modules/.bin/sequelize db:migrate
```

#### Install seed data

```
./node_modules/.bin/sequelize db:seed:all
```

<a name="development"></a>

## Run Development Server

By execute the following command, your app will be bootstraped and listen on port 3000

```shell
yarn devstart
```

> All change of your code will be listen by nodemoon and it will automatically restart your development server

If you want to change the port of the application, just add `PORT` environment variable

```shell
PORT=8080 yarn devstart
```

If you want your app run on multi thread, we need to add `MULTI_THREAD` environment variable

```shell
MULTI_THREAD=true yarn devstart
```

Or use built-in command

```shell
yarn devstart_multi_thread

```

<a name="development-docker"></a>

## Run Development Server Using Docker

If you are using docker, you just need to build the image based on docker-compose.yaml

> Make sure you already added `.env`

```
docker-compose up --build
```
If it going well you will see our application run on [http://localhost:4000](http://localhost:4400)

You can access your local database via phpMyAdmin on [http://localhost:4002](http://localhost:4402) also

<a name="production"></a>

## Run Production Server

By run `build` command it will compile whole application by `babel` with output is `dist` folder

```shell
yarn build
```

Start production application

```shell
ENV=production node ./bin/www
```

We also can use `PORT` and `MULTI_THREAD` environment variable

```shell
MULTI_THREAD=true PORT=8080 ENV=production node ./bin/www
```

<a name="coding-convention"></a>

## Coding Convention

#### Naming convenient for migration file

* Use `plural` format for model table name and singular model name format. Don't freeze table name, instead let sequelize decide the table
* Use `singular` format for relationship table and `freezeTableName`: `true` in sequelize model definition
* Migration database should be immutable, create new file if we want to modify the table with alter table inside (this way we can keep track of the history of our database)

```
YYYYMMDD_HHMMSS_create_table_name => create table
YYYYMMDD_HHMMSS_add_column_to_table_name => add column
YYYYMMDD_HHMMSS_update_table_name => for update table
```

<a name="command"></a>

## Command

`Command` is the command-line interface that is created for certain purpose. It provides a number of helpful commands that can assist you while you build your application. To view a list of all available commands, you may use the `--help` command

```shell
yarn command --help
```

To check how to use a certain command you can use `--help` on each, example to see how to use `make:validator` command

```shell
yarn command make:validator --help
```

#### Build your own command

By create a new file that is located in `./app/Console/Commands` you can create your own command

To make your command ready to use you have to register it in `./app/Console/Kernel.js`

```javascript
import { Command, Error, Info, Warning } from './Command';

export default class MakeValidatorCommand extends Command {
  signature() {
    // The command signature is required
    // You may pass how many argument you want
    return 'make:validator <first_argument> <second_argument>';
  }

  description() {
    // Description is optional
    return 'The description for your command here';
  }

  options() {
    // The array of your option, it's optional
    // There are two types of options: those that receive a value and those that don't.
    // If the option_name come with ? at the end, it mean this option don't want to receive any value, it will be boolean value
    // Now command support max 6 options
    return [{ key: 'option_name?', description: 'The description for option here' }];
  }

  async handle(first_argument, second_argument, options) {
    // Your code goes here
    // Error function can help you write a message to console log in red and exit current process
    // Info function can help you write a message to console log in green
    // Warning function can help you write a message to console log in red
  }
}
```
