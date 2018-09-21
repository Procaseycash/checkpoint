<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
<img src="https://img.shields.io/badge/👌-Production Ready-78c7ff.svg"/>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation on the project root

```bash
$ npm install
```


#### Database Configuration and Migration
Please setup latest version of <a href="https://docs.mongodb.com/manual/installation/" target="_blank"> mongodb </a> and  <a href="https://robomongo.org/download" target="_blank">robomongo</a> preferably and follow the instruction below.
    
The `src/config/config.json` consist of the DB information.

Please setup the `test`, `development` and `production` endpoint for the `mongodb`

#### Change Environment Command
```bash
# production mode
$ export NODE_ENV=production
    
# test mode
$ export NODE_ENV=test
    
# development mode
$ export NODE_ENV=development

```

### Application Running ports
You can change the below port from `src/config/app.config.ts`. 
```$xslt
Test: 4002 
    
Production: 4001
    
Development: 4000
```
### Run a Build Version

`$ npm run build` 

The build version can be found in `dist` folder from app root.

### Running the app
```bash
#development mode
$ npm run start:dev
    
#test mode
$ npm run start:test
    
#production mode
$ npm run start:prod
```

### DB Seeding After application is running
```bash
# From app root Development
    
$ npm run build
$ cd/dist
   
# Seed Command
    
### Development
### windows
$ npm run db:seed:all-win
### Unix
$ npm run db:seed:all
    
### Test
### windows
$ npm run db:seed:test:all-win
### Unix
$ npm run db:seed:test:all
    
### Production
### windows
$ npm run db:seed:prod:all-win
### Unix
$ npm run db:seed:prod:all
        
## Undo Seeded Data
Please choose an environment using the environment command stated above and then run:
$ npm run db:seed:undo      
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://opencollective.com/nest).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
