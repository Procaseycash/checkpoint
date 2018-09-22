import {Interceptor, NestInterceptor, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {ServicesService} from '../../services/services.service';
import {jwt} from '../../utils/jwt';
import {Session} from '../../session/session';
import {messages} from '../../config/messages.conf';
import {LogoutEnum} from '../../enums/logout.enum';

@Interceptor()
export class AuthorizationInterceptor implements NestInterceptor {
    constructor(private readonly servicesService: ServicesService) {
    }

    async intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Promise<Observable<any>> {
        if (dataOrRequest.headers.authorization) {
            const user = jwt.decode(dataOrRequest.headers.authorization);
            const userSession = jwt.decode(await Session.redis.getAsync(`user:session:${user.ref_token}`));
            if (!userSession || user.id !== userSession.id) {
                await this.servicesService.logout(LogoutEnum.SYSADMIN, user.ref_token);
                throw new UnauthorizedException(messages.sessionExpired);
            }
        }
        return stream$;
    }
}