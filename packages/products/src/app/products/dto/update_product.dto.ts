import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateProductDto } from "./create_product.dto";


@InputType()
export class UpdateProductDto extends PartialType(CreateProductDto){
    @Field(()=>String)
    id: string;
}