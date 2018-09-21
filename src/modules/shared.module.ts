import {forwardRef, Module} from '@nestjs/common';
import {HttpExceptionFilter} from '../shared/filters/http.exception.filter';
import {DbModule} from './db.module';
import {UserModule} from './user.module';
import {ServicesController} from '../controllers/services.controller';
import {
    counterRepo, loginInfoRepo, searchHistoryRepo,
} from '../repos/models.repository';
import {ServicesService} from '../services/services.service';
import {DecodeEncryptedRequestInterceptor} from '../shared/interceptors/decode.encrypted.request.interceptor';
import {HttpModule} from '@nestjs/common/http';
import {ReqInstanceInterceptor} from "../shared/interceptors/req.instance.interceptor";
import {SessionManagerInterceptor} from "../shared/interceptors/session.manager.interceptor";

@Module({
    imports: [
        DbModule,
        HttpModule,
        forwardRef(() => UserModule),
    ],
    components: [
        ...loginInfoRepo,
        ...counterRepo,
        ...searchHistoryRepo,
        ServicesService,
        HttpExceptionFilter,
        ReqInstanceInterceptor,
        DecodeEncryptedRequestInterceptor,
        SessionManagerInterceptor,
    ],
    exports: [
        ...loginInfoRepo,
        ...counterRepo,
        ...searchHistoryRepo,
        HttpExceptionFilter,
        ServicesService,
        DecodeEncryptedRequestInterceptor,
        ReqInstanceInterceptor,
        SessionManagerInterceptor,
        DbModule,
    ],
    controllers: [ServicesController],
})
export class SharedModule {

}