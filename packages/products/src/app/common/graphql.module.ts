import { Module } from "@nestjs/common";
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver} from '@nestjs/apollo';



@Module({
    imports:[
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: true,
            debug: true,
            playground: true
        })
    ]
})
export class GraphqlModule{}