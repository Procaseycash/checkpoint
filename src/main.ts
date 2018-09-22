import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as consolidate from 'consolidate';
import * as fileUpload from 'express-fileupload';
import * as path from 'path';
import {Swagger} from './swagger';
import {RolesGuard} from './shared/guards/role-guards';
import {HttpExceptionFilter} from './shared/filters/http.exception.filter';
import {ValidatorPipe} from './shared/pipes/validation.pipe';
import {ValidationModule} from './modules/validation.module';
import {Mail} from './utils/mail';
import {MailEnum} from './enums/mail.enum';
import {API_VERSION, PORT} from './config/app.config';
import {SharedModule} from './modules/shared.module';
import {Session} from './session/session';
import {ReqInstanceInterceptor} from './shared/interceptors/req.instance.interceptor';
import {AuthorizationInterceptor} from './shared/interceptors/authorization.interceptor';
import * as clc from 'cli-color';
import {PaymentMethodEnum} from "./enums/payment.method.enum";
import {MockPayment} from "./utils/mock.payment";

const expressInstance = express();
expressInstance.engine('html', consolidate.swig);
expressInstance.set('views', path.join(__dirname, 'public/views'));
expressInstance.set('view engine', 'html');
expressInstance.use('/public', express.static(path.join(__dirname, 'public')));
expressInstance.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
expressInstance.use(bodyParser.json({limit: '50mb'}));
expressInstance.use(fileUpload({
    limits: {fileSize: 20 * 1024 * 1024},
}));

expressInstance.get('/', (req, res) => res.redirect(301, 'api/'));

/**
 * Application bootstrap
 * @returns {Promise<void>}
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule, expressInstance, {});
    const authGuard = app.select(ValidationModule).get(RolesGuard);
    const validatorPipe = app.select(ValidationModule).get(ValidatorPipe);
    const httpExceptionFilter = app.select(SharedModule).get(HttpExceptionFilter);
    const reqInstanceInterceptor = app.select(SharedModule).get(ReqInstanceInterceptor);
    const authorizationInterceptor = app.select(SharedModule).get(AuthorizationInterceptor);
    app.useGlobalPipes(validatorPipe);
    app.useGlobalGuards(authGuard);
    app.useGlobalFilters(httpExceptionFilter);
    app.useGlobalInterceptors(reqInstanceInterceptor, authorizationInterceptor);
    app.setGlobalPrefix(API_VERSION);
    Mail.setEngine(MailEnum.MAILGUN); // set a default mailing system.
    Session.startRedis(); // start a single instance of redis and reuse globally
    MockPayment.defaultPaymentMethod = PaymentMethodEnum.PAYSTACK; // payment method used for paying a merchant from consumer wallet to merchant account
    console.log('engine=', Mail.getEngine(), 'port=', PORT);
    Swagger.configure();
    Swagger.setup(app);
    await app.listen(process.env.PORT || PORT);
    console.log(clc.yellowBright(`Application running on http://localhost:${process.env.PORT || PORT}/`));
}

bootstrap();
