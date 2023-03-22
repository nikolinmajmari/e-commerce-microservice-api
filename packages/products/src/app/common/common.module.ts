import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration.module';
import { GraphqlModule } from './graphql.module';
import { TypeOrmCustomModule } from './typeorm.module';


@Module({
    imports: [ConfigurationModule,TypeOrmCustomModule,GraphqlModule],
    exports: [ConfigurationModule,TypeOrmCustomModule,GraphqlModule],
})
export class CommonModule{}

