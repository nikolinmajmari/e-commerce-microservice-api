import { Field, InputType, PartialType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { CreateProductTypeDto } from "./product_type.create.dto";


@InputType()
export class UpdateProductTypeDto {
    @Field(()=>String)
    id: string;


    @ApiProperty()
    @IsString()
    @Field(()=>String)
    name?: string;
}