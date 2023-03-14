import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";


@InputType()
export class UpdateVariantAttributeDto{

    @Field(()=>String)
    id: string;

    @ApiProperty()
    @Field(()=>String)
    value?:string;


    @ApiProperty()
    @Field(()=>String)
    unit?: string;
}

