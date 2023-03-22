import {Field, InputType} from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import {IsString,IsPositive,IsNumber,IsEnum, IsArray, IsDecimal, isNotEmpty} from "class-validator";
import {  ProductType } from "../entities";
import { ProductStatus } from "../entities/product.entity";
import { Currency } from "../entities/variant_price.entity";


@InputType()
export class VariantPriceDto{


    @ApiProperty({
        type: Number,
        example: "123.34"
    })
    @Field(()=>String)
    price: number;


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
    @Field(()=>String)
    stock : number;


    @ApiProperty({
        type: VariantPriceDto,
        isArray: true
    })
    @IsArray()
    @Field(()=>[VariantPriceDto])
    prices: VariantPriceDto[];

    @ApiProperty({
        type: Boolean,
    })
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
    type: ProductType;

    @ApiProperty({
        type: VariantDto,
        isArray:true
    })
    @IsArray()
    @Field(()=>[VariantDto])
    variants: VariantDto[];
}
