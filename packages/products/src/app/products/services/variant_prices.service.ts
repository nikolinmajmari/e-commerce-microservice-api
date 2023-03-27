import { Injectable, Logger } from "@nestjs/common";
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { VariantPriceDto } from "../dto/create_product.dto";
import { VariantPrice } from "../entities";
import { Variant } from "../entities/variant.entity";
import { UpdateVariantPriceDto } from "../dto/variant_price.update.dto";

@Injectable()
export class VariantPriceService{
    constructor(
        @InjectRepository(Variant)
        private readonly variantRepository:Repository<Variant>,
        @InjectRepository(VariantPrice)
        private readonly variantPriceRepository: Repository<VariantPrice>,
     ){
    }

    async getVariantPrices(id:string){  
        const variant = await this.variantRepository.findOneOrFail({
            where:{ id: id,}, relations:{ prices: true,}
        });
        return await variant.prices;
    }


    /**
     * This method adds a price for a particular variant 
     * @param prod 
     * @param id 
     * @param priceDto 
     * @returns 
     */
    async addVariantPrice(id:string,priceDto:VariantPriceDto){
        const variant = await this.variantRepository.findOneOrFail({
          where:{  id: id }
        });
        const price = this.variantPriceRepository.create({
            ...priceDto,
            variant:variant,
        });
        return await this.variantPriceRepository.save(price);
    }

    async updateVariantPrice(variant:string,price:string,dto:UpdateVariantPriceDto){
        const filter = { id: price,variant:{id:variant}};
        if(Object.keys(dto).length!==0){
            await this.variantPriceRepository.update(filter,dto);
        }
        return await this.variantPriceRepository.findOneOrFail({
            where:filter
        });
    }

    async deleteVariantPrice(variant:string,price:string){
        const filter = { id: price,variant:{id:variant}};
        const entity = await this.variantPriceRepository.findOneOrFail({where:filter});
        await this.variantPriceRepository.remove(entity);
    }
}