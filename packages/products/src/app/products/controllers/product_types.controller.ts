import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Logger, Param, Patch, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { CreateAttributeDto } from '../dto/attribute.create.dto';
import { UpdateAttributeDto } from '../dto/attribute.update.dto';
import { CreateProductDto } from '../dto/create_product.dto';
import { CreateProductTypeDto } from '../dto/product_type.create.dto';
import { UpdateProductTypeDto } from '../dto/product_type.update.dto';
import { UpdateProductDto } from '../dto/update_product.dto';
import { TypeOrmNotFOundErrorFilter, TypeOrmUniqueConstraintVoilationFilter } from '../filters/typeorm.exception.filter';
import { ProductTypeService } from '../services/product_type.service';

@Controller('productTypes')
@ApiTags('product_types')
export class ProductTypesController {

    constructor(
        @Inject(ProductTypeService) 
        private readonly service:ProductTypeService
    ){
    }

    @Post()
    @HttpCode(201)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    async create(@Body() dto: CreateProductTypeDto){
        const created = await this.service.create(dto);
        return {id: created.id};
    }

    @Get()
    @HttpCode(200)
    async findAll(@Query("limit") limit: number|undefined,@Query("offset") offset: number|undefined){
        if(isNaN(limit)){
            limit = 10;
        }
        if(isNaN(offset)){
            offset=0;
        }
        return await this.service.findAll({
            limit: limit??10,
            offset: offset??0
        })
    }

    @Get(":id")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    @HttpCode(200)
    async findOne(@Param("id") id: string){
        const type =  await this.service.findOne(id);
        if(!type){
            throw new HttpException("Not Found",HttpStatus.NOT_FOUND);
        }
        return type;
    }

    @Patch(":id")
    update(@Param("id") id: string,@Body() dto: UpdateProductTypeDto){
        return this.service.update(id,dto);
    }

    @Delete(":id")
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    @HttpCode(204)
    async remove(@Param("id") id: string){
        if(!await this.service.remove(id)){
            throw new HttpException("Not Found",HttpStatus.NOT_FOUND);
        }
        return 204;
    }

    @Get(":id/attributes")
    getAttributes(@Param("id") id: string){
        return this.service.getAttributes(id);
    }

    @Post(":id/attributes")
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    addAttribute(@Param("id") id: string,@Body() dto: CreateAttributeDto){
        return this.service.addAtribute(id,dto);
    }

    @Patch(":id/attributes/:attr")
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    updateAttribute(@Param("id") id:string,@Param("attr") attr:string,@Body() dto: UpdateAttributeDto){
        return this.service.updateAttribute(id,attr,dto);
    }

    @Delete(":id/attributes/:attr")
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    @HttpCode(204)
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    async removeAttribute(@Param("id") id:string,@Param("attr") attr:string)
    {
        await this.service.removeAttribute(id,attr);
        return 204;
    }

}
