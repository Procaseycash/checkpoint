import {ExecutionContext, Interceptor, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {ReqInstance} from './req.instance';
import {jwt} from '../../utils/jwt';

@Interceptor()
export class ReqInstanceInterceptor implements NestInterceptor {
    intercept(dataOrRequest, context: ExecutionContext, call$: Observable<any>): Observable<any> {
        ReqInstance.req = dataOrRequest();
        if (ReqInstance.req.body) Object.assign(ReqInstance.req, ReqInstance.req.body);
        if (ReqInstance.req.headers && ReqInstance.req.headers.authorization) {
            ReqInstance.req['user'] = jwt.decode(ReqInstance.req.headers.authorization);
        }
        console.log('ReqInstance=', ReqInstance.req);
        return call$;
    }
}
