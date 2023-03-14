import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmpty, IsEnum, IsString } from "class-validator";
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
    @Field(()=>[CreateAttributeDto])
    attributes: CreateAttributeDto[];
}