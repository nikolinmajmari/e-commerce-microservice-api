import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class ListProductsInput{
    @Field(()=>Number,{description:"queried resource limit"})
    limit: number;
    @Field(()=>Number,{description:"queries resource offset"})
    offset: number
}