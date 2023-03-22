import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { CreateProductDto } from "../dto/create_product.dto";
import { ListProductsInput } from "../dto/list_products.input";
import { UpdateProductDto } from "../dto/update_product.dto";
import { Product } from "../entities/product.entity";
import { ProductsService } from "../services/products.service";




@Resolver(()=>Product)
export class ProductsResolver{
    constructor(private readonly productsService:ProductsService){

    }

    @Mutation(()=>Product)
    createProduct(@Args("dto") dto: CreateProductDto){
        return this.productsService.create(dto);
    }

    @Query(()=>Product,{name:"product"})
    findOne(@Args("id",{type:()=>String}) id: string){
        return this.productsService.findOne(id);
    }

    @Query(()=>[Product],{name:"products"})
    findAll(@Args("listProductsInput") ListProductsInput:ListProductsInput){
        return this.productsService.findAll(ListProductsInput);
    }

    @Mutation(()=>Product)
    updateProduct(@Args("updateProductInput") updateProductInput: UpdateProductDto){
        return this.productsService.update(updateProductInput.id,updateProductInput);
    }

    @Mutation(()=>Product)
    removeProduct(@Args("id",{type:()=>String}) id:string){
        return this.productsService.remove(id);
    }

}