import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Attribute, AttributeType } from "../entities/attribute.entity";
import { CreateAttributeDto } from "./attribute.create.dto";

@InputType()
export class CreateProductTypeDto{

    @ApiProperty()
    @IsString()
    @Field(()=>String)
    name: string;

    @ApiProperty({
        type: CreateAttributeDto,
        isArray: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsNotEmpty()
    @Type(()=>CreateAttributeDto)
    @Field(()=>[CreateAttributeDto])
    attributes: CreateAttributeDto[];
}