import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsEmpty, IsEnum, IsString } from "class-validator";
import { Attribute, AttributeType } from "../entities/attribute.entity";

@InputType()
export class CreateProductTypeDto{

    @IsString()
    @Field(()=>String)
    name: string;

    @IsArray()
    @Field(()=>[Attribute])
    attributes: Attribute[];
}