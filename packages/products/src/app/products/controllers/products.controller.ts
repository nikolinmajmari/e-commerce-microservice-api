import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto, VariantDto } from '../dto/create_product.dto';
import { UpdateProductDto } from '../dto/update_product.dto';
import { ProductsService } from '../services/products.service';

@Controller('products')
@ApiTags('products')
export class ProductsController {

    constructor(private readonly productsService:ProductsService){}

    @Post()
    create(@Body() dto: CreateProductDto){
        return this.productsService.create(dto);
    }

    @Get()
    findAll(){
        return this.productsService.findAll({limit: 10,offset: 0});
    }

    @Get(":id")
    findOne(@Param("id") id: string){
        return this.productsService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string,@Body() dto: UpdateProductDto){
        return this.productsService.update(id,dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string){
        return this.productsService.remove(id);
    }

    /// variant api 


    @Get(":id/variants")
    async getVariants(@Param("id") id:string){
        return this.productsService.getProductVariants(id);
    }

    @Post(":id/variants")
    async createVariant(
        @Param("id") id:string,
        @Body() dto:VariantDto
    ){
        const variant = await this.productsService.addProductVariant(id,dto);
        return {id:variant.id};
    }

    /// get specific variant
    @Get(":id/variants/:variant")
    async getVariant(@Param("id") id:string, @Param("variant") variant:string){
        return this.productsService.getProductVariant(id,variant);
    }

    @Patch(":id/variants/:variant")
    async patchVariant(@Param("id") id:string, @Param("variant") variant:string,@Body() dto:VariantDto){
        return this.productsService.updateProductVariant(id,variant,dto);
    }

    @Delete(":id/variants/:variant")
    async deleteVariant(@Param("id") id:string, @Param("variant") variant:string){
        return this.productsService.deleteProductVariant(id,variant);
    }
}
