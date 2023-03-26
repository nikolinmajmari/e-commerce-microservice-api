import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty, IsString } from "class-validator";
import { Attribute } from "../entities";

@InputType()
export class CreateVariantAttribute{

    @ApiProperty()
    @Field(()=>String)
    @IsString()
    value:string;

    @ApiProperty()
    @IsString()
    @Field(()=>String)
    unit: string;

    @ApiProperty()
    @Field(()=>String)
    @IsString()
    attribute: Attribute;
}


