import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration.module';
import { TypeOrmCustomModule } from './typeorm.module';


@Module({
    imports: [ConfigurationModule,TypeOrmCustomModule],
    exports: [ConfigurationModule,TypeOrmCustomModule]
})
export class CommonModule{}
