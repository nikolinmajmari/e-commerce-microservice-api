import { Body, Controller, Delete, Get, HttpCode, Inject, Logger, Param, Patch, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Topic } from '@repo/app-event-emitter';
import { Request } from 'express';
import { AdminAuthGuard } from '../../common/authz/admin.auth.guard';
import { RegisteredUserAuthGuard } from '../../common/authz/registered_user.auth.guard';
import { JwtAuthGuard } from '../../common/authz/jwt.auth.guard';
import { CreateProductDto, VariantDto } from '../dto/create_product.dto';
import { ListProductsInput } from '../dto/list_products.input';
import { ProductsFilter } from '../dto/products.filter.dto';
import { UpdateProductDto } from '../dto/update_product.dto';
import { UpdateVariantDto } from '../dto/variant.update.dto';
import { createProductAction, createProductVariantAction, deleteProductAction, updateProductAction } from '../events/custom.events';
import { TypeOrmNotFOundErrorFilter, TypeOrmUniqueConstraintVoilationFilter } from '../filters/typeorm.exception.filter';
import { ProductsService } from '../services/products.service';

@Controller('products')
@ApiTags('products')
export class ProductsController {

      async onModuleInit() {
        await this.client.connect();
      }
    
      async onModuleDestroy() {
        await this.client.close();
      }
    

    constructor(
        private readonly productsService:ProductsService,
         @Inject('product_kafka_client') 
        private readonly client: ClientKafka
         ){}

    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    async create(@Body() dto: CreateProductDto,@Req() request:Request){
        const created =  await this.productsService.create(dto);
        Logger.log(request.user);
        this.client.emit(Topic.APP_ACTION,createProductAction(request));
        return {id:created.id};
    }

    @Get()
    @ApiProperty({
        name:"search",required: false
    })
    @ApiProperty({
        name:"search",required: false
    })
    @ApiProperty({
        name:"limit",required: false
    })
    @ApiProperty({
        name:"offfset",required: false
    })
    @ApiProperty({
        name:"tags",required: false
    })
    findAll(
        @Query("search") search?:string,
        @Query("limit") limit?:string,
        @Query("offfset") offset?: string,
        @Query("tags") tags?: string,
    ){
        return this.productsService.findAll({
            search: search,
            limit: parseInt(limit),
            offset: parseInt(offset),
            tags: tags.split(",")
        });
    }

    @Get(":id")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    findOne(@Param("id") id: string){
        return this.productsService.findOne(id);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    async update(@Param("id") id: string,@Body() dto: UpdateProductDto,@Req() req:Request){
        const updated =  await this.productsService.update(id,dto);
        this.client.emit(Topic.APP_ACTION,updateProductAction(req));
        return updated;
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @HttpCode(204)
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async remove(@Param("id") id: string,@Req() req:Request){
        await this.productsService.remove(id);
        this.client.emit(Topic.APP_ACTION,deleteProductAction(req));
    }

    /// variant api 


    
    @Get(":id/variants")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async getVariants(@Param("id") id:string){
        return this.productsService.getProductVariants(id);
    }


    @Post(":id/variants")
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @HttpCode(201)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async createVariant(
        @Param("id") id:string,
        @Body() dto:VariantDto,
        @Req() req:Request
    ){
        const variant = await this.productsService.addProductVariant(id,dto);
        this.client.emit(Topic.APP_ACTION,createProductVariantAction(req))
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
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async patchVariant(@Param("id") id:string, @Param("variant") variant:string,@Body() dto:UpdateVariantDto){
        return this.productsService.updateProductVariant(id,variant,dto);
    }


    @Delete(":id/variants/:variant")
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async deleteVariant(@Param("id") id:string, @Param("variant") variant:string){
        return this.productsService.deleteProductVariant(id,variant);
    }
}
