import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsString } from "class-validator";
import { AttributeType } from "../entities/attribute.entity";


@InputType()
export class CreateAttributeDto{
    
    @ApiProperty()
    @IsString()
    @Field(()=>String)
    name: string;

    @ApiProperty({
        type: AttributeType,
        enum: [AttributeType.FLOAT,AttributeType.INT,AttributeType.TEXT]
    })
    @IsEnum(AttributeType)
    @Field(()=>AttributeType)
    type: AttributeType;

    @ApiProperty()
    @IsBoolean()
    @Field(()=>Boolean)
    searchable: boolean;

    @ApiProperty()
    @IsBoolean()
    @Field(()=>Boolean)
    required: boolean;
}