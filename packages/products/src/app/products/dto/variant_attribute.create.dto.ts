import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

@InputType()
export class CreateVariantAttribute{

    @ApiProperty()
    @Field(()=>String)
    value:string;

    @ApiProperty()
    @Field(()=>String)
    unit: string;

    @ApiProperty()
    @Field(()=>String)
    attribute: string;
}


