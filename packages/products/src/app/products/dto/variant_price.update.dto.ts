import { Field, InputType } from "@nestjs/graphql";
import { PartialType } from "@nestjs/swagger";
import { VariantPriceDto } from "./create_product.dto";



@InputType()
export class UpdateVariantPriceDto extends PartialType(VariantPriceDto){
    @Field(()=>String)
    id: string;
}