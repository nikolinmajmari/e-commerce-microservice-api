import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

@InputType()
export class ProductsFilter{

    @ApiProperty({
        "name":"limit",
        type: Number
    })
    @Field(()=>Number,{description:"queried resource limit"})
    limit?: number;
    
    @ApiProperty({
        "name":"offset",
        type: Number
    })
    @Field(()=>Number,{description:"queries resource offset"})
    offset?: number;

    @ApiProperty({
        type: String
    })
    @Field(()=>Number,{description:"queries resource offset"})
    search?:string;
    @ApiProperty({
        type: String
    })
    @Field(()=>Number,{description:"queries resource offset"})
    category?:string;

    @ApiProperty({
        type: Array
    })
    @Field(()=>Number,{description:"queries resource offset"})
    tags?:string;
}