import {forwardRef, Module} from '@nestjs/common';
import {HttpExceptionFilter} from '../shared/filters/http.exception.filter';
import {DbModule} from './db.module';
import {UserModule} from './user.module';
import {ServicesController} from '../controllers/services.controller';
import {
    counterRepo, loginInfoRepo, searchHistoryRepo,
    serviceRepo
} from '../repos/models.repository';
import {ServicesService} from '../services/services.service';
import {DecodeEncryptedRequestInterceptor} from '../shared/interceptors/decode.encrypted.request.interceptor';
import {HttpModule} from '@nestjs/common/http';

@Module({
    imports: [
        DbModule,
        HttpModule,
        forwardRef(() => UserModule),
    ],
    components: [
        ...loginInfoRepo,
        ...serviceRepo,
        ...counterRepo,
        ...searchHistoryRepo,
        ServicesService,
        HttpExceptionFilter,
        DecodeEncryptedRequestInterceptor,
    ],
    exports: [
        ...loginInfoRepo,
        ...serviceRepo,
        ...counterRepo,
        ...searchHistoryRepo,
        HttpExceptionFilter,
        ServicesService,
        DecodeEncryptedRequestInterceptor,
        DbModule,
    ],
    controllers: [ServicesController],
})
export class SharedModule {

}