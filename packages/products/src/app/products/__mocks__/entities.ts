import { Attribute, ProductType } from "../entities";
import {Chance} from "chance";
import crypto from "node:crypto";
import { AttributeType } from "../entities/attribute.entity";
import { Any } from "typeorm";
import { CreateProductTypeDto } from "../dto/product_type.create.dto";

const genUUID = async (uuid=true)=>uuid?crypto.randomUUID():undefined;

const chance = new Chance();


export async function getProductTypeMock(uuid=true):Promise<ProductType>{
    return {
        id: await genUUID(uuid),
        attributes:getAttributeMocks(),
        createdAt: chance.date(),
        name: chance.word(),
        updatedAt: chance.date()
    };
}

export async function getProductTypeDtoMock():Promise<CreateProductTypeDto>{
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


export async function getAttributeMock(uuid=true):Promise<Attribute>{
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

export async function getAttributeMocks(uuid=true):Promise<Attribute[]>{
    return [
        await getAttributeMock(uuid),
        await getAttributeMock(uuid),
        await getAttributeMock(uuid),
    ];
}

export async function getProductsTypeMocks(uuid=true):Promise<ProductType[]> {
    return [
        await getProductTypeMock(uuid),
        await getProductTypeMock(uuid),
    ];
}