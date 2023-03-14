import { DataSource } from "typeorm";
import dotenv from "dotenv";
import {  
Attribute,Category,Product,VariantAttribute,ProductType,Variant,VariantPrice  
} from "./products/entities";

dotenv.config();


const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST_TEST,
    port: parseInt(process.env.DB_PORT_TEST.toString()),
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABASE_TEST,
    entities: [
        Attribute,Category,Product,VariantAttribute,ProductType,Variant,VariantPrice 
    ]
});

export async function cleanDatabase(connection:DataSource): Promise<void> {
    try {
      const entities = connection.entityMetadatas;
      const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(", ");
      
      await connection.query(`TRUNCATE ${tableNames} CASCADE;`);
      console.log("[TEST DATABASE]: Clean");
    } catch (error) {
      throw new Error(`ERROR: Cleaning test database: ${error}`);
    }
}

export default dataSource;