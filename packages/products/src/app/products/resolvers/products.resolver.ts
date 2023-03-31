import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { AdminAuthGuard, AdminGQLAuthGuard } from "../../common/authz/admin.auth.guard";
import { JwtGQLAuthGuard } from "../../common/authz/gql.auth.guard";
import { CreateProductDto } from "../dto/create_product.dto";
import { ListProductsInput } from "../dto/list_products.input";
import { UpdateProductDto } from "../dto/update_product.dto";
import { Product } from "../entities/product.entity";
import { GraphqlErrorHandler, TypeOrmNotFOundErrorFilter, TypeOrmUniqueConstraintVoilationFilter } from "../filters/typeorm.exception.filter";
import { ProductsService } from "../services/products.service";




@Resolver(()=>Product)
export class ProductsResolver{
    constructor(private readonly productsService:ProductsService){

    }

    @UseGuards(JwtGQLAuthGuard,AdminGQLAuthGuard)
    @Mutation(()=>Product) 
    @UseFilters(new GraphqlErrorHandler())
    createProduct(@Args("dto") dto: CreateProductDto){
        return this.productsService.create(dto);
    }

    @Query(()=>Product,{name:"product"})
    @UseFilters(new GraphqlErrorHandler())
    findOne(@Args("id",{type:()=>String}) id: string){
        return this.productsService.findOne(id);
    }

    @Query(()=>[Product],{name:"products"})
    findAll(@Args("listProductsInput") ListProductsInput:ListProductsInput){
        return this.productsService.findAll(ListProductsInput);
    }

    @Mutation(()=>Product)
    @UseGuards(JwtGQLAuthGuard,AdminGQLAuthGuard)
    @UseFilters(new GraphqlErrorHandler())
    updateProduct(@Args("updateProductInput") updateProductInput: UpdateProductDto){
        return this.productsService.update(updateProductInput.id,updateProductInput);
    }

    @Mutation(()=>Product)
    @UseGuards(JwtGQLAuthGuard,AdminGQLAuthGuard)
    @UseFilters(new GraphqlErrorHandler())
    removeProduct(@Args("id",{type:()=>String}) id:string){
        return this.productsService.remove(id);
    }

}