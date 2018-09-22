
import {forwardRef, Module} from '@nestjs/common';
import {SharedModule} from './shared.module';
import {consumerRepo, merchantRepo, userRepo} from '../repos/models.repository';
import {UserService} from '../services/user.service';
import {UserController} from '../controllers/user.controller';
import {AuthController} from '../controllers/auth.controller';
import {MerchantController} from '../controllers/merchant.controller';
import {ConsumerController} from '../controllers/consumer.controller';
import {MerchantService} from '../services/merchant.service';

@Module({
    imports: [forwardRef(() => SharedModule)],
    controllers: [UserController, AuthController, MerchantController, ConsumerController],
    components: [UserService, MerchantService, ConsumerController, ...userRepo, ...merchantRepo, ...consumerRepo],
    exports: [UserService, MerchantService, ConsumerController, ...userRepo, ...merchantRepo, ...consumerRepo],
})
export class UserModule {}