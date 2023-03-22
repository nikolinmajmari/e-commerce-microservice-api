import { Field, InputType, PartialType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsString } from "class-validator";
import { ProductStatus } from "../entities/product.entity";
import { CreateProductDto } from "./create_product.dto";


@InputType()
export class UpdateProductDtoBase{
    @Field(()=>String)
    id: string;

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

}
@InputType()
export class UpdateProductDto extends PartialType(UpdateProductDtoBase){
    @Field(()=>String)
    id: string;

}