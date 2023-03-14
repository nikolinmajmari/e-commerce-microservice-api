import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAttributeDto } from '../dto/attribute.update.dto';
import { VariantPriceDto } from '../dto/create_product.dto';
import { CreateVariantAttribute } from '../dto/variant_attribute.create.dto';
import { ProductsService } from '../services/products.service';

@Controller('variants')
@ApiTags("variants")
export class VariantsController {

    constructor(private readonly productsService:ProductsService){}


        //// price api 
        @Get(":id/prices")
        async getVariantPrices(@Param("id") id:string){
            return this.productsService.getVariantPrices(id);
        }
    
        
        @Post(":id/prices")
        async addVariantPrice(@Param("id") id:string,@Body() dto:VariantPriceDto){
            const entity =  await this.productsService.addVariantPrice(id,dto);
            return {id: entity.id};
        }
    
        /// get specific variant
        @Patch(":id/prices/:price")
        async updateVariantPrice(
           @Param("id") id:string, 
           @Param("price") price:string,
           @Body() dto:VariantPriceDto
           ){
            return this.productsService.updateVariantPrice(id,price,dto);
        }
    
        /// get specific variant
        /// get specific variant
        @Delete(":id/prices/:price")
        async deleteVariatPrice(
            @Param("id") id:string, 
            @Param("price") price:string,
           ){
            return this.productsService.deleteVariantPrice(id,price);
        }

    //// attribute api
     @Get(":id/attributes")
     async getVariantAttributes(@Param("id") id:string){
         return this.productsService.getVariantAttributes(id);
     }
 
     @Post(":id/attributes")
     async createVariantAttribute(
        @Param("id") id:string,
        @Body() dto:CreateVariantAttribute){
         const entity =  await this.productsService.addVariantAttribute(id,dto);
         return {id: ( entity).id};
     }
 
     /// get specific variant
     @Patch(":id/attributes/:attr")
     async updateVariantAttribute(
        @Param("id") id:string,
        @Param("attr") attr:string,
        @Body() dto:UpdateAttributeDto
        ){
         return this.productsService.updateVariantAttribute(id,attr,dto);
     }
 
     /// get specific variant
     @Delete(":id/attributes/:attr")
     async deleteVariatAttribute(
        @Param("id") id:string, 
        @Param("attr") attr:string
        ){
         return this.productsService.deleteVariantAttribute(id,attr);
     }
}
