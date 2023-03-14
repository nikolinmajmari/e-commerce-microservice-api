import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { CreateAttributeDto } from '../dto/attribute.create.dto';
import { UpdateAttributeDto } from '../dto/attribute.update.dto';
import { CreateProductDto } from '../dto/create_product.dto';
import { CreateProductTypeDto } from '../dto/product_type.create.dto';
import { UpdateProductTypeDto } from '../dto/product_type.update.dto';
import { UpdateProductDto } from '../dto/update_product.dto';
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
    async create(@Body() dto: CreateProductTypeDto){
        const created = await this.service.create(dto);
        return {id: created.id};
    }

    @Get()
    async findAll(@Query("limit") limit: number|undefined,@Query("offset") offset: number|undefined){
        return await this.service.findAll({
            limit: limit??10,
            offset: offset??0
        })
    }

    @Get(":id")
    async findOne(@Param("id") id: string){
        return await this.service.findOne(id);
    }

    @Patch(":id")
    update(@Param("id") id: string,@Body() dto: UpdateProductTypeDto){
        return this.service.update(id,dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string){
        return this.service.remove(id);
    }

    @Get(":id/attributes")
    getAttributes(@Param("id") id: string){
        return this.service.getAttributes(id);
    }

    @Post(":id/attributes")
    addAttribute(@Param("id") id: string,@Body() dto: CreateAttributeDto){
        return this.service.addAtribute(id,dto);
    }

    @Patch(":id/attributes/:attr")
    updateAttribute(@Param("id") id:string,@Param("attr") attr:string,@Body() dto: UpdateAttributeDto){
        return this.service.updateAttribute(id,attr,dto);
    }

    @Delete(":id/attributes/:attr")
    removeAttribute(@Param("id") id:string,@Param("attr") attr:string)
    {
        return this.service.removeAttribute(id,attr);
    }

}
