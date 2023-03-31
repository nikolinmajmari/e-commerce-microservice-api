import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";


@InputType()
export class ListProductsInput{
    @ApiProperty({
        "name":"limit",
        type: Number,
        required:false,
    })
    @Field(()=>Number,{description:"queried resource limit"})
    limit?: number;
    
    @ApiProperty({
        "name":"offset",
        type: Number,
        required:false,
    })
    @Field(()=>Number,{description:"queries resource offset"})
    offset?: number;

    @ApiProperty({
        type: String,
        required:false,
    })
    @Field(()=>Number,{description:"search by name"})
    search?:string;


    @ApiProperty({
        type: String,
        required:false,
    })
    @Field(()=>Number,{description:"search by category"})
    category?:string;

    @ApiProperty({
        type: Array,
        required:false,
    })
    @Field(()=>Number,{description:"search by tags"})
    tags?:string[];

}