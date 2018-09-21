import {Module} from '@nestjs/common';
import {RolesGuard} from '../shared/guards/role-guards';
import {ValidatorPipe} from '../shared/pipes/validation.pipe';

@Module({
    components: [RolesGuard, ValidatorPipe],
})
export class ValidationModule {}
