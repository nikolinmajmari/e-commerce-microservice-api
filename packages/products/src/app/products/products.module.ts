import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { 
    Attribute,Category,Product,VariantAttribute,ProductType,Variant,VariantPrice  
} from '../products/entities';
import { ProductsController } from "./controllers/products.controller";
import { ProductTypesController } from "./controllers/product_types.controller";
import { VariantsController } from "./controllers/variant.controller";
import { ProductsResolver } from "./resolvers/products.resolver";
import { ProductsService } from "./services/products.service";
import { VariantPriceService } from "./services/variant_prices.service";
import { VariantAttributeService } from "./services/variant_attributes.service";
import { ProductTypeService } from "./services/product_type.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [TypeOrmModule.forFeature([
    Attribute,Category,Product,VariantAttribute,ProductType,Variant,VariantPrice  
    ]),
    ClientsModule.register([
        {
            name: "product_kafka_client",
            transport: Transport.KAFKA,
            options:{
            client:{
                clientId:"productService20202",
                brokers:[process.env.KAFKA_BROKER_1] 
            }
        }
    }]),


],
    controllers: [ProductsController,ProductTypesController,VariantsController],
    providers:[ProductsService,ProductsResolver,ProductTypeService,VariantAttributeService,VariantPriceService]
})
export class ProductsModule{}