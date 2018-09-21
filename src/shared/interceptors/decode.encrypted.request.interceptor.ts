import {Interceptor, NestInterceptor, ExecutionContext} from '@nestjs/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {encryption} from '../../utils/encryption';

@Interceptor()
export class DecodeEncryptedRequestInterceptor implements NestInterceptor {
    intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Observable<any> {
        if (dataOrRequest.body['data_encoded'] && dataOrRequest.body['data_encoded'].constructor === String) {
            dataOrRequest.body = encryption.decode(dataOrRequest.body['data_encoded']);
        }
        return stream$;
    }
}