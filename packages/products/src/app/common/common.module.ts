import { Module } from '@nestjs/common';
import { ConfigurationModule } from './configuration.module';
import { GraphqlModule } from './graphql.module';
import { TypeOrmCustomModule } from './typeorm.module';
import { AuthzModule } from './authz.module';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmCustomModule,
    GraphqlModule,
    AuthzModule,
  ],
  exports: [ConfigurationModule, TypeOrmCustomModule, GraphqlModule,AuthzModule],
})
export class CommonModule {}
