import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { CreateProductDto } from "./dto/create_product.dto";
import { ListProductsInput } from "./dto/list_products.input";
import { UpdateProductDto } from "./dto/update_product.dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductsService } from "./products.service";




@Resolver(()=>ProductEntity)
export class ProductsResolver{
    constructor(private readonly productsService:ProductsService){

    }


    @Mutation(()=>ProductEntity)
    crreateProduct(@Args("dto") dto: CreateProductDto){
        return this.productsService.create(dto);
    }

    @Query(()=>ProductEntity,{name:"product"})
    findOne(@Args("id",{type:()=>String}) id: string){
        return this.productsService.findOne(id);
    }

    @Query(()=>[ProductEntity],{name:"products"})
    findAll(@Args("listProductsInput") ListProductsInput:ListProductsInput){
        return this.productsService.findAll(ListProductsInput);
    }

    @Mutation(()=>ProductEntity)
    updateProduct(@Args("updateProductInput") updateProductInput: UpdateProductDto){
        return this.productsService.update(updateProductInput.id,updateProductInput);
    }

    @Mutation(()=>ProductEntity)
    removeProduct(@Args("id",{type:()=>String}) id:string){
        return this.productsService.remove(id);
    }

}