
import {forwardRef, Module} from '@nestjs/common';
import {SharedModule} from './shared.module';
import {travellerRepo, merchantRepo, userRepo} from '../repos/models.repository';
import {UserService} from '../services/user.service';
import {UserController} from '../controllers/user.controller';
import {AuthController} from '../controllers/auth.controller';
import {MerchantController} from '../controllers/merchant.controller';
import {TravellerController} from '../controllers/traveller.controller';
import {MerchantService} from '../services/merchant.service';
import {TravellerService} from "../services/traveller.service";

@Module({
    imports: [forwardRef(() => SharedModule)],
    controllers: [UserController, AuthController, MerchantController, TravellerController],
    components: [UserService, MerchantService, TravellerService, ...userRepo, ...merchantRepo, ...travellerRepo],
    exports: [UserService, MerchantService, TravellerService, ...userRepo, ...merchantRepo, ...travellerRepo],
})
export class UserModule {}