import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Attribute,Category,Product,ProductAttribute,ProductType,Variant,VariantPrice  } from '../products/entities';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory: async (config:ConfigService)=>{
                return {
                keepAlive: true,
                type: "postgres",
                host: config.get<string>("DB_HOST"),
                port: config.get<number>("DB_PORT"),
                username: config.get<string>("DB_USERNAME"),
                password: config.get<string>("DB_PASSWORD"),
                database: config.get<string>("DB_DATABASE"),
                migrations: ["**/migrations/*.js"],
                migrationsRun: true,
                synchronize: true,
                entities:[
                    Attribute,Category,Product,ProductAttribute,ProductType,Variant,VariantPrice 
               ]
            };},
            inject: [ConfigService]
        })
    ],
})
export class TypeOrmCustomModule{}