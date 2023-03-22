import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

@InputType()
export class UpdateVariantAttributeBaseDto{

    @ApiProperty()
    @Field(()=>String)
    @IsString()
    value:string;

    @ApiProperty()
    @IsString()
    @Field(()=>String)
    unit: string;
}


@InputType()
export class UpdateVariantAttributeDto extends PartialType(UpdateVariantAttributeBaseDto){

    @Field(()=>String)
    id: string;
}




