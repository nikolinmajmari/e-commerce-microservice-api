import { Field, InputType, PartialType } from "@nestjs/graphql";
import { VariantDto } from "./create_product.dto";


@InputType()
export class UpdateVariantDto extends PartialType(VariantDto){
    @Field(()=>String)
    id: string;
}