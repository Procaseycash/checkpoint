import {Interceptor, NestInterceptor, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {ServicesService} from '../../services/services.service';
import {jwt} from '../../utils/jwt';
import {Session} from '../../session/session';
import {messages} from '../../config/messages.conf';
import {LogoutEnum} from '../../enums/logout.enum';
import {sessionTimeoutPeriod} from '../../config/app.config';

@Interceptor()
export class SessionManagerInterceptor implements NestInterceptor {
    constructor(private readonly servicesService: ServicesService) {
    }

    async intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Promise<Observable<any>> {
        if (dataOrRequest.headers.authorization) {
            const user = jwt.decode(dataOrRequest.headers.authorization);
            const userSession = await Session.redis.getAsync(`user:session:${user.ref_token}`);
            if (!userSession) {
                await this.servicesService.logout(LogoutEnum.SYSADMIN, user.ref_token);
                throw new UnauthorizedException(messages.sessionExpired);
            }
            const timeout = await sessionTimeoutPeriod();
            console.log({timeout});
            Session.redis.expire(`user:session:${user.ref_token}`, timeout);
        }
        return stream$;
    }
}