import { DataSource } from 'typeorm';
import dotenv from "dotenv";
import { Attribute,Category,Product,ProductAttribute,ProductType,Variant,VariantPrice } from './products/entities';
import { initialDb1678000899386 } from '../migrations/1678000899386-initial-db';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT.toString()),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Attribute,Category,Product,ProductAttribute,ProductType,Variant,VariantPrice 
  ],
  migrations:[
    initialDb1678000899386
  ]
});
