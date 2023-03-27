
import { Inject, Injectable, Logger } from "@nestjs/common";
import {InjectRepository} from '@nestjs/typeorm';
import { EntityManager, Repository } from "typeorm";
import { CreateVariantAttribute } from "../dto/variant_attribute.create.dto";
import { VariantAttribute } from "../entities";
import { Variant } from "../entities/variant.entity";
import { ProductTypeService } from "./product_type.service";
import { UpdateVariantAttributeDto } from "../dto/variant_attribute.update.dto";

@Injectable()
export class VariantAttributeService{
    constructor(
        @Inject(EntityManager) 
        private readonly em:EntityManager,
        @InjectRepository(Variant)
        private readonly variantRepository:Repository<Variant>,
        @InjectRepository(VariantAttribute)
        private readonly variantAttributeRepository:Repository<VariantAttribute>,
        @Inject(ProductTypeService)
        private readonly productTypeService
     ){
    }


    //// attributes methods
    async getVariantAttributes(id:string){
        const attributes = await this.variantAttributeRepository.find({
            where: {variant:{id:id}},relations: {attribute: true}
        })
        return attributes;
    }

    /// add variant attribute 
    async addVariantAttribute(id:string,dto:CreateVariantAttribute){
        /// in case an error is thrown is error 404
        const queryRunner = this.em.connection.createQueryRunner("slave");
        await queryRunner.connect();
        try{

            queryRunner.startTransaction("REPEATABLE READ");
            const variant = await this.variantRepository.findOneOrFail({
                where:{id:id}
            });
            const product = await variant.product;
            const type = await product.type;    
            const attribute = await this.productTypeService.getAttribute(
                type.id,dto.attribute as unknown as  string
            );
            const createdAttribute = this.variantAttributeRepository.create({
                unit: dto.unit,value: dto.value,
            });
            createdAttribute.attribute = attribute;
            createdAttribute.variant = variant;
            const result = await this.variantAttributeRepository.save(createdAttribute);
            await queryRunner.commitTransaction();
            return result;
        }catch(e){
            await queryRunner.rollbackTransaction();
            throw e;
        }finally{
            await queryRunner.release();
        }
    }


    async updateVariantAttribute(variant:string,variantAttribute:string,dto:UpdateVariantAttributeDto){
        Logger.log(dto.unit,dto.value,dto.id);
        const filter = { id: variantAttribute,variant:{id:variant}};
        if(Object.keys(dto).length!==0){
            await this.variantAttributeRepository.update({
                id: variantAttribute,
                variant:{id: variant}
                },dto
            );
        }
        return await this.variantAttributeRepository.findOneOrFail(
            {where: filter,relations:{attribute:true}}
        );
    }


    async deleteVariantAttribute(variant:string,variantAttribute:string){
        const entity = await this.variantAttributeRepository.findOneOrFail({
           where:{
            variant:{id:variant},
            id: variantAttribute
           }
        });
        await this.variantAttributeRepository.remove(entity);
    }

}