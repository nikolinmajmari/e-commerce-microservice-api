import {Field, InputType} from "@nestjs/graphql";
import {IsString,IsNotEmpty,IsPositive,IsNumber,IsEnum, IsArray, IsDecimal} from "class-validator";
import { ProductStatus } from "../entities/product.entity";
import { Currency } from "../entities/variant_price.entity";

@InputType()
export class CreateProductDto{

    @IsString()
    @Field(()=>String)
    name: string;

    @IsEnum(ProductStatus,{message: "Please specify a valid value"})
    @Field(()=>String)
    status: string;

    @IsArray()
    @IsString({each: true})
    @Field(()=>[String])
    tags: string[];
    
    @IsArray()
    @IsString({each: true})
    @Field(()=>[String])
    images: [];

    @IsNotEmpty()
    @Field(()=>[VariantDto])
    variants?: VariantDto[];
}

@InputType()
export class VariantDto{
    @IsString()
    @Field(()=>String)
    sku: string;

    @IsString()
    @Field(()=>String)
    title: string;

    @IsArray()
    @IsString({each: true})
    @Field(()=>[String])
    images: [];

    @IsNumber()
    @IsPositive()
    @Field(()=>String)
    stock : number;

    @IsNumber()
    @IsPositive()
    @Field(()=>String,{nullable: true})
    weight?: number;

    @IsString()
    @Field(()=>String,{nullable: true})
    weight_unit?:string;

    @IsArray()
    @Field(()=>[VariantPriceDto])
    prices: VariantPriceDto[];
}

@InputType()
export class VariantPriceDto{
    @IsDecimal({decimal_digits:"10,2"})
    @Field(()=>String)
    price: number;

    @IsEnum(Currency)
    @Field(()=>String)
    currency:Currency;
}

