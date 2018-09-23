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

## ANSWERS TO TEST 0 
1. Tell us how you will approach this problem?

    The approach I will use is `3-tier architecture` such that each users can actually make use of their resources to process client end activities and the backend focuses on request to act on (running as a service and stateless).
    
    Also, I will make sure the structure is `modular ` and so that resources can be reuse efficiently. I will also put in check `request size` that will be required is minimal in terms of what output the application will give and I will make sure the application can `run in parallel` that is able create child clusters to enable concurrency.


2.  Explain to us what data points you need to track?

       I will consider the following in tracking the data points of the application.
      <br>    
      a) <b>Performance:</b> I will consider the API latency which the request to a response round trip considering the level of users. I will also end to end communication either backend to backend communication or backend end to database communication, so I will work my way to make sure this communication are handled in a lighter way to reduce the response time to the client end application.
      
      b) <b>User Engagement:</b> As for the traveller which are the major users, I will check the location starting point to end point, the time interval to get to destination. Also I will compare the auto location dictator to user define location for start and end point. that way I will be able to know if the system is being cheated or game by the user. I will also consider the user session interval and session length. I will also log every trip taken by the user for data mining to aid analysing the system better. <br>. The point value and amount earn is also considered such that we auto-create a wallet system for the traveller to enable him/her see her point score and worth. <br>
      As for the merchant, I will make sure a merchant information exchange must be verify using the generated Merchant Key and Validating there username&password to enable generation of a merchant secret aside JWT. 
    
      c) <b>Security: </b> I will also consider the authentication to be put in place to avoid system mess up. I will make sensitive information are encrypted between the client system and the backend system, by this means, there will be public and private key measures between secret informations between the system. 
      
      d) <b>Errors: </b> I will also make sure errors are handled and respond are given in a special format and I will put in place a system to track all kinds of errors that might occur in the system to aid in fixing and maintaining the system better.

3.  what authorization process you will put in place to ensure people don’t game the system?: The system uses JWT as authorization mechanism and requires subsequent resend of this token to verify as Authorization in header of the request. <br>
To avoid being game by user. We also make use of a Role Based system and a single entry point login system to avoid multiple emails of same type in different part of the system.
<br><br>Also, we put in check User Defined Location to Auto-Location Detector mechanism such that for every check-in. we calculate the difference in terms of Kilometer covered and benchmark the result against 10KM to determine an increase in point. So, we concluded that if the difference is above the 10KM threshold, We deduct the excessive KM before processing the value point increase and amount. 

4. How will you architect the system to be able to handle 10,000 request per second?: We will make it a microservice architecture and create child processes to run the application in parallel for request throughput to increase.

5. What will you refine if the checkin surges to 100,000 per second base on a popular event at a location?

    I will do the followings:
    
    a) Increase the server specs.
    
    b) Load balance both Hard and Soft load balance to create multiple entry points to the application.
    
    c) I will also review Answer to question 4 to enhance throughput. 


## APP Description

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
Test: 6002 
    
Production: 6003
    
Development: 6001
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

All test account password for seeded data: Password@123

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

## DISTANCE MATRIX API_KEY
Please change the API_KEY from `config/app.config.ts` to a paid version API_KEY as the one in use is limited. 

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://opencollective.com/nest).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
