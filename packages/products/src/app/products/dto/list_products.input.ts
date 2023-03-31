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
    @Field(()=>String,{description:"search by name",nullable:true})
    search?:string;


    @ApiProperty({
        type: String,
        required:false,
    })
    @Field(()=>String,{description:"search by category",nullable:true})
    category?:string;

    @ApiProperty({
        type: Array,
        required:false,
    })
    @Field(()=>String,{description:"search by tags",nullable:true})
    tags?:string[];

}