import { Inject, Injectable, Logger } from "@nestjs/common";
import {InjectRepository} from '@nestjs/typeorm';
import { EntityManager, Repository } from "typeorm";
import { CreateProductDto, VariantDto, VariantPriceDto } from "../dto/create_product.dto";
import { ListProductsInput } from "../dto/list_products.input";
import { UpdateProductDto } from "../dto/update_product.dto";
import { UpdateVariantDto } from "../dto/variant.update.dto";
import { VariantAttribute, VariantPrice } from "../entities";
import { Product } from "../entities/product.entity";
import { Variant } from "../entities/variant.entity";


@Injectable()
export class ProductsService{
    constructor(
        @Inject(EntityManager) 
        private readonly em:EntityManager,
        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,
        @InjectRepository(Variant)
        private readonly variantRepository:Repository<Variant>,
        @InjectRepository(VariantAttribute)
        private readonly variantAttributeRepository:Repository<VariantAttribute>,
        @InjectRepository(VariantPrice)
        private readonly variantPriceRepository: Repository<VariantPrice>
    ){
    }
    
    async create(dto: CreateProductDto){
        const queryRunner = this.em.connection.createQueryRunner("master");
        await queryRunner.connect();
        try{
            await queryRunner.startTransaction("REPEATABLE READ");
            const product = this.productRepository.create(dto);
            await queryRunner.manager.save(product);
            await queryRunner.commitTransaction();
           return product;
        }catch(e){
            Logger.log(e);
            await queryRunner.rollbackTransaction();
            throw e;
        }finally{
            await queryRunner.release();
        }
    }


    async findAll(listProductsInput:ListProductsInput){
        return this.productRepository.find({
            skip: listProductsInput.offset,
            take: listProductsInput.limit
        })
    }

    async findOne(id:string){
        return this.productRepository.findOneOrFail({
            where: {
                id: id
            },
            relations:{
                variants: true
            }
        })
    }

    async update(id: string, dto: UpdateProductDto){
        if(Object.keys(dto).length!==0){
            await  this.productRepository.update(id,dto);
        }
        return this.productRepository.findOneOrFail({
            where: {id:id}
        });
    }

    async remove(id: string){
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }

    async getProductVariants(prod:string){
        return await this.variantRepository.find({
            where:{
                product: {id: prod}
            }
        })
    }

    async getVariant(id:string){
        return await this.variantRepository.findOneOrFail({
            where:{ id: id,}, relations:{ prices: true,attributes:true}
        });
    }

    async getProductVariant(prod:string,variant:string){
        return this.variantRepository.findOneOrFail({
            where:{
                id: variant,
                product:{id:prod},
            },
            relations:{
                prices: true,
                attributes: true,
            }
        })
    }

    async makeProductVariantsAsNonMain(product:string){
        return await  this.variantRepository.update({
            product: {id: product},
        },{main: false});
    }

    async addProductVariant(prod:string,dto:VariantDto){
        const product = await this.findOne(prod);
        const variant = this.variantRepository.create(dto);
        variant.product = product;
        if(variant.main){
            await this.makeProductVariantsAsNonMain(prod);
        }
        const saved = await this.variantRepository.save(variant,{
            transaction:true
        });
        return saved;
    }

    async updateProductVariant(prod:string,variant :string,dto:UpdateVariantDto){
        if(Object.keys(dto).length!==0){
            if(dto.main){
                await this.makeProductVariantsAsNonMain(prod);
            }
            await this.variantRepository.update({
                id: variant,
                product: {id:prod}
            },dto);
        }
        return await this.variantRepository.findOneOrFail({
            where:{id:variant}
        });
    }

    async deleteProductVariant(prod:string,variant:string){
        const queryRunner = this.em.connection.createQueryRunner("master");
        queryRunner.connect();
        try{
            await queryRunner.startTransaction();
            const entity = await this.getProductVariant(prod,variant);
            for(const price of await entity.prices){
               await this.variantPriceRepository.remove(price);
            }
            for(const attribute of await entity.attributes){
                await this.variantAttributeRepository.remove(attribute);
            }
            await this.variantRepository.remove(entity);
            queryRunner.commitTransaction();
        }catch(e){
            queryRunner.rollbackTransaction();
            throw e;
        }finally{
            queryRunner.release();
        }
    }
}