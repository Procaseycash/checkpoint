
import { Module } from '@nestjs/common';
import { databaseRepository } from '../repos/db.repository';

@Module({
    components: [...databaseRepository],
    exports: [...databaseRepository],
})
export class DbModule {}