import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create_product.dto';
import { UpdateProductDto } from './dto/update_product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService:ProductsService){

    }

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
}
