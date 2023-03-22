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
        return await this.repository.findOneOrFail({
            where:{
                id:id
            },
            relations:{
                attributes:true
            }
        })
    }

    async update(id: string, dto: UpdateProductTypeDto){
       if(Object.keys(dto).length!==0){
        await this.repository.update({
            id: id
        },dto);
       }
       return await this.repository.findOne({
        where:{id}
       });
    }

    async remove(id: string){
        const type = await this.findOne(id);
        if(type){
            for(const attr of await type.attributes){
                this.attributeRepository.remove(attr);
            }
            await this.repository.remove([type]);
        }
        return type;
    }

    async getAttributes(id: string){
        return this.attributeRepository.findBy({
            productType: {id: id}
        })
    }

    async addAtribute(id: string,dto:CreateAttributeDto){
        const type = await this.findOne(id);
        const attribute = this.attributeRepository.create(dto);
        attribute.productType = type;
        await this.attributeRepository.save(attribute);
        return await this.attributeRepository.findOneByOrFail({id:attribute.id});
    }

    async getAttribute(prod:string,attr:string){
        return await this.attributeRepository.findOneByOrFail({
            id: attr,
            productType: {id:prod}
        });
    }

    async updateAttribute(prod: string, attr: string,dto: UpdateAttributeDto){
        if (Object.keys(dto).length !== 0){
            await this.attributeRepository.update({
                productType:{id:prod},
                id: attr
            },dto);
        }
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