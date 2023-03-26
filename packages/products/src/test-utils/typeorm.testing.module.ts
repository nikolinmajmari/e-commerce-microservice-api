import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityList } from '../app/products/entities';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host:"localhost",
    database:"test_db",
    password:"myPass!23",
    port:5433,
    dropSchema: true,
    entities: EntityList,
    synchronize: true,
  }),
  TypeOrmModule.forFeature(EntityList),
];