import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateProductTypeDto } from "./product_type.create.dto";


@InputType()
export class UpdateProductTypeDto extends PartialType(CreateProductTypeDto){
    @Field(()=>String)
    id: string;
}