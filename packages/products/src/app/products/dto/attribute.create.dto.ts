import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsString } from "class-validator";
import { AttributeType } from "../entities/attribute.entity";

@InputType()
export class CreateAttributeDto{

    @IsString()
    @Field(()=>String)
    name: string;

    @IsEnum(AttributeType)
    @Field(()=>AttributeType)
    type: AttributeType;

    @IsBoolean()
    @Field(()=>Boolean)
    searchable: boolean;

    @IsBoolean()
    @Field(()=>Boolean)
    required: boolean;
}