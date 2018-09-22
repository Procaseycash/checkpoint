import {Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {UserModule} from './modules/user.module';
import {CorsMiddleware} from './shared/middlewares/cors-middleware';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {SharedModule} from './modules/shared.module';
import {ValidationModule} from "./modules/validation.module";

@Module({
    imports: [
        UserModule, SharedModule, ValidationModule,
    ],
    controllers: [AppController],
    components: [],
})
export class AppModule implements NestModule {
    configure(traveller: MiddlewaresConsumer): void {
        traveller.apply(CorsMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
    }
}