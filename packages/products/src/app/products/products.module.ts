import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { 
    Attribute,Category,Product,ProductAttribute,ProductType,Variant,VariantPrice  
} from '../products/entities';
import { ProductsController } from "./controllers/products.controller";
import { ProductTypesController } from "./controllers/product_types.controller";
import { ProductsResolver } from "./resolvers/products.resolver";
import { ProductsService } from "./services/products.service";
import { ProductTypeService } from "./services/product_type.service";


@Module({
    imports: [TypeOrmModule.forFeature([
    Attribute,Category,Product,ProductAttribute,ProductType,Variant,VariantPrice  
    ])],
    controllers: [ProductsController,ProductTypesController],
    providers:[ProductsService,ProductsResolver,ProductTypeService]
})
export class ProductsModule{}