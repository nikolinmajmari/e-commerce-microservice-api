import { Inject, Injectable, Logger } from "@nestjs/common";
import {InjectRepository} from '@nestjs/typeorm';
import { EntityManager, Repository } from "typeorm";
import { CreateProductDto, VariantDto, VariantPriceDto } from "../dto/create_product.dto";
import { ListProductsInput } from "../dto/list_products.input";
import { UpdateProductDto } from "../dto/update_product.dto";
import { UpdateVariantDto } from "../dto/variant.update.dto";
import { CreateVariantAttribute } from "../dto/variant_attribute.create.dto";
import { Attribute, VariantAttribute, VariantPrice } from "../entities";
import { Product } from "../entities/product.entity";
import { Variant } from "../entities/variant.entity";
import { ProductTypeService } from "./product_type.service";
import debug from "debug";
import { UpdateVariantAttributeDto } from "../dto/variant_attribute.update.dto";
const log = debug("app:main");

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
        private readonly variantPriceRepository: Repository<VariantPrice>,
        @Inject(ProductTypeService)
        private readonly productTypeService:ProductTypeService
    ){
    }
    
    async create(dto: CreateProductDto){
        const queryRunner = this.em.connection.createQueryRunner("master");
        await queryRunner.connect();
        try{
            await queryRunner.startTransaction("REPEATABLE READ");
            const product = this.productRepository.create(dto);
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
        await this.em.remove(product);
    }

    async getProductVariants(prod:string){
        return await this.em.getRepository(Variant).findBy({
            product: {id: prod}
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
        return await this.variantRepository.save(variant);
    }

    async updateProductVariant(prod:string,variant :string,dto:VariantDto){
         await this.variantRepository.update({
            id: variant,
            product: {id:prod}
        },dto);
        return await this.variantRepository.findOneByOrFail({id:variant});
    }

    async deleteProductVariant(prod:string,variant:string){
        await this.variantRepository.delete({
            id: variant,
            product: {id:prod}
        })
    }


    //// prices methods 

    /**
     * Get variant prices 
     * @param prod 
     * @param id 
     * @returns 
     */
    async getProductVariantPrices(prod:string,id:string){
        const variant = await this.getProductVariant(prod,id);
        return await variant.prices;
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
        const variant = await this.getVariant(id);
        const price = this.variantPriceRepository.create({
            ...priceDto,
            variant:variant,
        });
        return await this.variantPriceRepository.save(price);
    }

    async updateVariantPrice(variant:string,price:string,dto:VariantPriceDto){
        const filter = { id: price,variant:{id:variant}};
        await this.variantPriceRepository.update(filter,dto);
        return await this.variantPriceRepository.findOneByOrFail(filter);
    }

    async deleteVariantPrice(variant:string,price:string){
        const filter = { id: price,variant:{id:variant}};
        const entity = await this.variantPriceRepository.findOneByOrFail(filter)
        return await this.variantPriceRepository.remove(entity);
    }

    //// attributes methods
    async getVariantAttributes(id:string){
        const variant = await this.getVariant(id);
        return await variant.attributes;
    }

    /// add variant attribute 
    async addVariantAttribute(id:string,dto:CreateVariantAttribute){
        /// in case an error is thrown is error 404
        const variant = await this.getVariant(id);
        const product = await variant.product;
        const type = await product.type;

        const queryRunner = this.em.connection.createQueryRunner("slave");
        await queryRunner.connect();
        try{
            queryRunner.startTransaction("REPEATABLE READ");
            const attribute = await this.productTypeService.getAttribute(type.id,dto.attribute);
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
        await this.variantAttributeRepository.update({
            id: variantAttribute,
            variant:{id:variant}
        },dto);
    }


    async deleteVariantAttribute(variant:string,variantAttribute:string){
        const entity = await this.variantAttributeRepository.findOneByOrFail({
            variant:{id:variant},
            id: variantAttribute
        });
        await this.variantAttributeRepository.remove(entity);
    }

}