import { Attribute, ProductType, Variant, VariantAttribute, VariantPrice } from "../entities";
import {Chance} from "chance";
import crypto from "node:crypto";
import { AttributeType } from "../entities/attribute.entity";
import { Any } from "typeorm";
import { CreateProductTypeDto } from "../dto/product_type.create.dto";
import { Currency } from "../entities/variant_price.entity";
import { CreateProductDto, VariantDto, VariantPriceDto } from "../dto/create_product.dto";
import { CreateVariantAttribute } from "../dto/variant_attribute.create.dto";
import { Product, ProductStatus } from "../entities/product.entity";

const genUUID = async (uuid=true)=>uuid?crypto.randomUUID():undefined;

const chance = new Chance();
export function memoThenable(generator){
    return {
        state:undefined,
        then(resolve){
            if(this.state==undefined){
                this.state = generator();
            }
            resolve(this.state);
        }
    }
}

//// product type
export async function createProductTypeDtoMock():Promise<CreateProductTypeDto>{
    return {
        name: chance.word(),
        attributes:[
            {
                name: chance.word(),
                required: true,
                searchable: true,
                type: AttributeType.FLOAT
            }
        ]
    };
}

export async function createProductTypeMock(uuid=true){
    return {
        id: await genUUID(uuid),
        createdAt: chance.date(),
        name: chance.word(),
        updatedAt: chance.date(),
        attributes:memoThenable(
            async()=>await createAttributeMocks()
        )
    };
}

export async function createProductsTypeMocks(uuid=true):Promise<ProductType[]> {
    return [
            await createProductTypeMock(uuid) as any
    ];
}

//// attribute
export async function createAttributeMock(uuid=true):Promise<Attribute>{
    return {
        id:await genUUID(uuid),
        createdAt: chance.date(),
        name: chance.word(),
        updatedAt: chance.date(),
        required: true,
        searchable: true,
        type: AttributeType.TEXT,
     };
};

export async function createAttributeMocks(uuid=true):Promise<Attribute[]>{
    return [
        await createAttributeMock(uuid),
    ];
}

/// prices

export function createVariantPriceDto():VariantPriceDto{
    return {
        active: chance.bool(),
        currency: Currency.ALL,
        price: chance.floating()
    };
}

export async function createVariantPrice(uuid=true):Promise<VariantPrice>{
    return {
        active: chance.bool(),
        createdAt: chance.date(),
        currency: Currency.ALL,
        id: await genUUID(uuid),
        price: 200.02,
        updatedAt: chance.date(),
    };
}

export async function createVariantPrices(){
    return [
        await createVariantPrice(true),
    ];
}
//// variant attributes
export function createVariantAttributeDto():CreateVariantAttribute{
    return {
        attribute: chance.string() as any,
        unit: chance.string(),
        value: chance.word(),
    };
}

export async function createVariantAttribute(uuid=true):Promise<VariantAttribute>{
    return {
        id: await genUUID(uuid),
        attribute: memoThenable(async()=>await createAttributeMock(true)),
        createdAt: chance.date(),
        unit: chance.word(),
        updatedAt: chance.date(),
        value: chance.word()
    };
}

export async function createVariantAttributes():Promise<VariantAttribute[]>{
    return  [
        await createVariantAttribute(true),
        
    ];
}
/// variants 
export function createVariantDto():VariantDto{
    return {
        images: [],
        prices: [
            createVariantPriceDto(),
        ],
        sku: chance.word(),
        stock: 1,
        title: chance.string(),
        main: chance.bool(),
        attributes: [
            createVariantAttributeDto(),
        ]
    }
}

export async function createProductVariant(uuid=true):Promise<Variant>{
    return {
        id: await genUUID(uuid),
        attributes:createVariantAttributes(),
        createdAt: chance.date(),
        images: [],
        main: chance.bool(),
        prices: createVariantPrices(),
        sku: chance.string(),
        stock: 2,
        product: memoThenable(
            async()=>await createProductMock()
        ),
        title: chance.word(),
        updatedAt: chance.date()
    };
}

export async function createProductVariants(){
    return [
        await createProductVariant(),
    ];
}

/// products
export function createProductDto():CreateProductDto{
    return {
        images:[],
        name:chance.name(),
        status: ProductStatus.ACTIVE,
        tags: [],
        type: chance.string() as any,
        variants: [
            createVariantDto(),
            createVariantDto(),
            createVariantDto(),
        ],
    };
}

export async function createProductMock(uuid=true):Promise<Product>{
    return {
        id: await genUUID(uuid),
        categories: [],
        createdAt: chance.date(),
        images:[],
        name: chance.name(),
        status: ProductStatus.ACTIVE,
        type: memoThenable(
            async ()=>await createProductTypeMock()
        ),
        updatedAt: chance.date(),
        variants:[],//createProductVariants(),
        tags:[]
    };
} 

export async function createProductListMock(){
    return [
        await createProductMock(),
    ];
}