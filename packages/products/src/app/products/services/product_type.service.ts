import { Inject, Injectable } from "@nestjs/common";
import {InjectRepository} from '@nestjs/typeorm';
import { EntityManager, Repository } from "typeorm";
import { CreateAttributeDto } from "../dto/attribute.create.dto";
import { UpdateAttributeDto } from "../dto/attribute.update.dto";
import { CreateProductDto } from "../dto/create_product.dto";
import { PageDto } from "../dto/page.dto";
import { CreateProductTypeDto } from "../dto/product_type.create.dto";
import { Attribute, ProductType } from "../entities";
import debug from "debug";
import { UpdateProductTypeDto } from "../dto/product_type.update.dto";

@Injectable()
export class ProductTypeService{
    constructor(
        @Inject(EntityManager) 
        private readonly em:EntityManager,
        @InjectRepository(Attribute)
        private readonly attributeRepository:Repository<Attribute>,
        @InjectRepository(ProductType)
        private readonly repository: Repository<ProductType>
    ){
    }

    async create(dto: CreateProductTypeDto){
        const productType = await this.repository.save(
            this.repository.create(dto)
        );
        return productType;
    }


    async findAll(page:PageDto){
       return await this.repository.find({
          relations:["attributes"],
          skip: page.offset,
          take: page.limit,
       })
    }

    async findOne(id:string){
        return await this.repository.findOneByOrFail({
            id: id,
        })
    }

    async update(id: string, dto: UpdateProductTypeDto){
        const result = await this.repository.update({
            id: id
        },dto);
       return result.raw;
    }

    async remove(id: string){
        const attribute = await this.findOne(id);
        await this.repository.remove([attribute]);
    }

    async getAttributes(prod: string){
        return this.attributeRepository.findBy({
            productType: {id: prod}
        })
    }

    async addAtribute(prod: string,dto:CreateAttributeDto){
        const product = await this.findOne(prod);
        console.log(product);
        (await product.attributes).push(
            this.attributeRepository.create(dto)
        );
        await this.repository.save(product,{transaction:true});
    }

    async getAttribute(prod:string,attr:string){
        return await this.attributeRepository.findOneByOrFail({
            id: attr,
            productType: {id:prod}
        });
    }

    async updateAttribute(prod: string, attr: string,dto: UpdateAttributeDto){
        await this.attributeRepository.update({
            productType:{id:prod},
            id: attr
        },dto);
        return await this.getAttribute(prod,attr);
    }

    async removeAttribute(prod: string,attr: string){
        const attribute = await this.attributeRepository.findOneByOrFail({
            id: attr,
            productType: {id: prod}
        });
        await this.attributeRepository.remove(attribute);
    }
}