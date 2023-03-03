import { DataSource } from 'typeorm';
import { ProductEntity } from './products/entities/product.entity';
import { VariantEntity } from './products/entities/variant.entity';
import dotenv from "dotenv";
import { initialSetup1677882574591 } from '../migrations/1677882574591-initial-setup';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT.toString()),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    VariantEntity,ProductEntity
  ],
  migrations:[
    initialSetup1677882574591
  ]
});