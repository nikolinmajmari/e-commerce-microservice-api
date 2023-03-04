import { Inject, Injectable } from "@nestjs/common";
import {InjectRepository} from '@nestjs/typeorm';
import { EntityManager, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create_product.dto";
import { ListProductsInput } from "./dto/list_products.input";
import { UpdateProductDto } from "./dto/update_product.dto";
import { ProductEntity } from "./entities/product.entity";
import { VariantEntity } from "./entities/variant.entity";

@Injectable()
export class ProductsService{
    constructor(
        @Inject(EntityManager) 
        private readonly em:EntityManager,
        @InjectRepository(ProductEntity)
        private readonly productRepository:Repository<ProductEntity>,
        @InjectRepository(VariantEntity)
        private readonly variantRepository:Repository<VariantEntity>
    ){
    }

    async create(dto: CreateProductDto){
        const queryRunner = this.em.connection.createQueryRunner("master");
        await queryRunner.connect();
        try{
            await queryRunner.startTransaction("REPEATABLE READ");
            const product = this.productRepository.create({
                ...dto
            });
            await queryRunner.manager.save(product);
            dto.variants.map(async (variant)=>{
                const productVariant = this.variantRepository.create({...variant});
                productVariant.product = product;
                await queryRunner.manager.save(productVariant);
            });
            await queryRunner.commitTransaction();
            return product;
        }catch(e){
            await queryRunner.rollbackTransaction();
            throw e;
        }finally{
            await queryRunner.release();
        }
    }


    async findAll(listProductsInput:ListProductsInput){
        return this.productRepository.findAndCount({
            skip: listProductsInput.offset,
            take: listProductsInput.limit
        })
    }

    async findOne(id:string){
        return this.productRepository.findOne({
            where: {
                id: id
            },
            relations:{
                variants: true
            }
        })
    }

    async update(id: string, dto: UpdateProductDto){
        const updated = await  this.productRepository.update(id,dto);
        return updated.generatedMaps;
    }

    async remove(id: string){
        const product = await this.findOne(id);
        await this.em.remove(product);
    }
}