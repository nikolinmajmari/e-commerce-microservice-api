import { VariantEntity } from "../entities/variant.entity";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class VariantDto{
    @Field(()=>String)
    sku: string;

    @Field(()=>String)
    title: string;

    @Field(()=>String,{nullable: true})
    weight?: number;

    @Field(()=>String,{nullable: true})
    weight_unit?:string;
}

@InputType()
export class CreateProductDto{
    @Field(()=>String)
    name: string;
    @Field(()=>String)
    status: string;
    @Field(()=>[VariantDto])
    variants: VariantDto[];
}