import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto, VariantDto } from '../dto/create_product.dto';
import { UpdateProductDto } from '../dto/update_product.dto';
import { UpdateVariantDto } from '../dto/variant.update.dto';
import { TypeOrmNotFOundErrorFilter, TypeOrmUniqueConstraintVoilationFilter } from '../filters/typeorm.exception.filter';
import { ProductsService } from '../services/products.service';

@Controller('products')
@ApiTags('products')
export class ProductsController {

    constructor(private readonly productsService:ProductsService){}

    @Post()
    @HttpCode(201)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    create(@Body() dto: CreateProductDto){
        return this.productsService.create(dto);
    }

    @Get()
    findAll(){
        return this.productsService.findAll({limit: 10,offset: 0});
    }

    @Get(":id")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    findOne(@Param("id") id: string){
        return this.productsService.findOne(id);
    }

    @Patch(":id")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    update(@Param("id") id: string,@Body() dto: UpdateProductDto){
        return this.productsService.update(id,dto);
    }

    @Delete(":id")
    @HttpCode(204)
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    remove(@Param("id") id: string){
        return this.productsService.remove(id);
    }

    /// variant api 


    @Get(":id/variants")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async getVariants(@Param("id") id:string){
        return this.productsService.getProductVariants(id);
    }

    @Post(":id/variants")
    @HttpCode(201)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async createVariant(
        @Param("id") id:string,
        @Body() dto:VariantDto
    ){
        const variant = await this.productsService.addProductVariant(id,dto);
        return {id:variant.id};
    }

    /// get specific variant
    @Get(":id/variants/:variant")
    @HttpCode(200)
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async getVariant(@Param("id") id:string, @Param("variant") variant:string){
        return this.productsService.getProductVariant(id,variant);
    }

    @Patch(":id/variants/:variant")
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async patchVariant(@Param("id") id:string, @Param("variant") variant:string,@Body() dto:UpdateVariantDto){
        return this.productsService.updateProductVariant(id,variant,dto);
    }

    @Delete(":id/variants/:variant")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async deleteVariant(@Param("id") id:string, @Param("variant") variant:string){
        return this.productsService.deleteProductVariant(id,variant);
    }
}
