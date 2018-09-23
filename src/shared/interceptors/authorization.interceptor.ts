import {
    Interceptor, NestInterceptor, ExecutionContext, UnauthorizedException,
    NotAcceptableException
} from '@nestjs/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {ServicesService} from '../../services/services.service';
import {jwt} from '../../utils/jwt';
import {Session} from '../../session/session';
import {messages} from '../../config/messages.conf';
import {LogoutEnum} from '../../enums/logout.enum';
import {MerchantService} from "../../services/merchant.service";
import {ReqInstance} from "./req.instance";

@Interceptor()
export class AuthorizationInterceptor implements NestInterceptor {
    constructor(private readonly merchantService: MerchantService, private readonly servicesService: ServicesService) {
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

        if (dataOrRequest.headers.merchant_key) {
            const data = await this.merchantService.getMerchantByKey(dataOrRequest.headers.merchant_key);
            ReqInstance.req.user = data;
            if (!data) throw new UnauthorizedException(messages.invalidMerchantKey);
        }

        if (dataOrRequest.headers.merchant_secret) {
            ReqInstance.req.user = await this.merchantService.decryptMerchantSecret({secret: dataOrRequest.headers.merchant_secret});
        }

        return stream$;
    }
}