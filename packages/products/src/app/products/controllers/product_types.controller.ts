import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Logger, Param, Patch, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../common/authz/admin.auth.guard';
import { RegisteredUserAuthGuard } from '../../common/authz/registered_user.auth.guard';
import { JwtAuthGuard } from '../../common/authz/jwt.auth.guard';
import { CreateAttributeDto } from '../dto/attribute.create.dto';
import { UpdateAttributeDto } from '../dto/attribute.update.dto';
import { CreateProductTypeDto } from '../dto/product_type.create.dto';
import { UpdateProductTypeDto } from '../dto/product_type.update.dto';
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
    
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
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
    @HttpCode(200)
    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    update(@Param("id") id: string,@Body() dto: UpdateProductTypeDto){
        return this.service.update(id,dto);
    }

    @Delete(":id")
    @HttpCode(204)

    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    async remove(@Param("id") id: string){
        await this.service.remove(id);
    }

    @Get(":id/attributes")
    getAttributes(@Param("id") id: string){
        return this.service.getAttributes(id);
    }

    @Post(":id/attributes")

    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    addAttribute(@Param("id") id: string,@Body() dto: CreateAttributeDto){
        return this.service.addAtribute(id,dto);
    }

    @Patch(":id/attributes/:attr")

    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmUniqueConstraintVoilationFilter())
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    updateAttribute(@Param("id") id:string,@Param("attr") attr:string,@Body() dto: UpdateAttributeDto){
        return this.service.updateAttribute(id,attr,dto);
    }

    @Delete(":id/attributes/:attr")

    @UseGuards(JwtAuthGuard,AdminAuthGuard,RegisteredUserAuthGuard)
    @UseFilters(new TypeOrmNotFOundErrorFilter())
    @HttpCode(204)
    async removeAttribute(@Param("id") id:string,@Param("attr") attr:string)
    {
        await this.service.removeAttribute(id,attr);
        return 204;
    }

}
