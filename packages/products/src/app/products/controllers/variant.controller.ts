import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAttributeDto } from '../dto/attribute.update.dto';
import { VariantPriceDto } from '../dto/create_product.dto';
import { CreateVariantAttribute } from '../dto/variant_attribute.create.dto';
import { UpdateVariantAttributeDto } from '../dto/variant_attribute.update.dto';
import { UpdateVariantPriceDto } from '../dto/variant_price.update.dto';
import { TypeOrmNotFOundErrorFilter, TypeOrmUniqueConstraintVoilationFilter } from '../filters/typeorm.exception.filter';
import { ProductsService } from '../services/products.service';

@Controller('variants')
@ApiTags("variants")
export class VariantsController {

    constructor(private readonly productsService:ProductsService){}


        //// price api 
        @Get(":id/prices")
        @UseFilters(new TypeOrmNotFOundErrorFilter())
        async getVariantPrices(@Param("id") id:string){
            return this.productsService.getVariantPrices(id);
        }
    
        
        @Post(":id/prices")
        @UseFilters(new TypeOrmNotFOundErrorFilter())
        async addVariantPrice(@Param("id") id:string,@Body() dto:VariantPriceDto){
            const entity =  await this.productsService.addVariantPrice(id,dto);
            return {id: entity.id};
        }
    
        /// get specific variant
        @Patch(":id/prices/:price")
        @UseFilters(new TypeOrmNotFOundErrorFilter())
        async updateVariantPrice(
           @Param("id") id:string, 
           @Param("price") price:string,
           @Body() dto:UpdateVariantPriceDto
           ){
            return this.productsService.updateVariantPrice(id,price,dto);
        }
    
        /// get specific variant
        /// get specific variant
        @Delete(":id/prices/:price")
        @UseFilters(new TypeOrmNotFOundErrorFilter())
        async deleteVariatPrice(
            @Param("id") id:string, 
            @Param("price") price:string,
           ){
            return this.productsService.deleteVariantPrice(id,price);
        }

    //// attribute api
     @Get(":id/attributes")
     @UseFilters(new TypeOrmNotFOundErrorFilter())
     async getVariantAttributes(@Param("id") id:string){
         return this.productsService.getVariantAttributes(id);
     }
 
     @Post(":id/attributes")
     @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
     @UseFilters(new TypeOrmNotFOundErrorFilter())
     async createVariantAttribute(
        @Param("id") id:string,
        @Body() dto:CreateVariantAttribute){
         const entity =  await this.productsService.addVariantAttribute(id,dto);
         return {id: ( entity).id};
     }
 
     /// get specific variant
     @Patch(":id/attributes/:attr")
     @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
     @UseFilters(new TypeOrmNotFOundErrorFilter())
     async updateVariantAttribute(
        @Param("id") id:string,
        @Param("attr") attr:string,
        @Body() dto:UpdateVariantAttributeDto
        ){
            Logger.log(JSON.stringify(dto));
         return this.productsService.updateVariantAttribute(id,attr,dto);
     }
 
     /// get specific variant
     @Delete(":id/attributes/:attr")
     @HttpCode(204)
     @UseFilters(new TypeOrmNotFOundErrorFilter())
     async deleteVariatAttribute(
        @Param("id") id:string, 
        @Param("attr") attr:string
        ){
         return this.productsService.deleteVariantAttribute(id,attr);
     }
}
