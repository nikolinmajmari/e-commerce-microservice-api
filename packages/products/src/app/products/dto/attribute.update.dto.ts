import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateAttributeDto } from "./attribute.create.dto";


@InputType()
export class UpdateAttributeDto extends PartialType(CreateAttributeDto){
    @Field(()=>String)
    id: string;
}