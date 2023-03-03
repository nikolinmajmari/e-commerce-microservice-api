import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { VariantEntity } from "./entities/variant.entity";
import { ProductsController } from "./products.controller";
import { ProductsResolver } from "./products.resolver";
import { ProductsService } from "./products.service";


@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity,VariantEntity])],
    controllers: [ProductsController],
    providers:[ProductsService,ProductsResolver]
})
export class ProductsModule{}