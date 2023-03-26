import {Field, Float, InputType, Int} from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {IsString,IsPositive,IsNumber,IsEnum, IsArray, IsDecimal, isNotEmpty, ValidateNested, ArrayMinSize, IsNotEmpty, IsBoolean} from "class-validator";
import {  ProductType } from "../entities";
import { ProductStatus } from "../entities/product.entity";
import { Currency } from "../entities/variant_price.entity";
import { CreateVariantAttribute } from "./variant_attribute.create.dto";


@InputType()
export class VariantPriceDto{


    @ApiProperty({
        type: Number,
        example: "123.34"
    })
    @Field(()=>Float)
    @IsNumber()
    price: number;


    @ApiProperty({
        type: Boolean,
        example: true
    })
    @IsBoolean()
    @Field(()=>Boolean)
    active:boolean;


    @ApiProperty({
        type: String,
        enum: [Currency.ALL,Currency.EUR,Currency.USD]
    })
    @IsEnum(Currency)
    @Field(()=>String)
    currency:Currency;
}


@InputType()
export class VariantDto{
    
    @ApiProperty()
    @IsString()
    @Field(()=>String)
    sku: string;

    @ApiProperty()
    @IsString()
    @Field(()=>String)
    title: string;

    @ApiProperty({
        type: String,
        isArray: true
    })
    @IsArray()
    @IsString({each: true})
    @Field(()=>[String])
    images: [];


    @ApiProperty({
        type: Number,
        default: 0
    })
    @IsNumber()
    @IsPositive()
    @Field(()=>Int)
    stock : number;


    @ApiProperty({
        type: VariantPriceDto,
        isArray: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(()=>VariantPriceDto)
    @Field(()=>[VariantPriceDto])
    prices: VariantPriceDto[];

    @ApiProperty({
        type: CreateVariantAttribute,
        isArray: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(()=>CreateVariantAttribute)
    @Field(()=>[CreateVariantAttribute])
    attributes?:CreateVariantAttribute[];

    @ApiProperty({
        type: Boolean,
    })
    @IsBoolean()
    @Field(()=>Boolean)
    main?: boolean;

}

@InputType()
export class CreateProductDto{

    @IsString()
    @Field(()=>String)
    @ApiProperty()
    name: string;

    @IsEnum(ProductStatus)
    @Field(()=>String)
    @ApiProperty({
        enum: [ProductStatus.ACTIVE,ProductStatus.INACTIVE],
        type: String
    })
    status: string;

    @ApiProperty({
        isArray: true,
        type: String
    })
    @IsArray()
    @IsString({each: true})
    @Field(()=>[String])
    tags: string[];
    
    @ApiProperty({
        isArray: true,
        type: String
    })
    @IsArray()
    @IsString({each: true})
    @Field(()=>[String])
    images: string[];

    @ApiProperty({
        type: String
    })
    @Field(()=>String)
    @IsString()
    type: ProductType;

    @ApiProperty({
        type: VariantDto,
        isArray:true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Field(()=>[VariantDto])
    @Type(()=>VariantDto)
    variants: VariantDto[];
}
