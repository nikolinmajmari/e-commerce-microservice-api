import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DecimalTransformer } from "../transformers/decimal.transformer";
import { Variant } from "./variant.entity";

export enum Currency {
    USD = "USD",
    EUR="EUR",
    ALL="ALL",
}

@ObjectType()
@Entity({name: "variant_price"})
export class VariantPrice{

    @Field(()=>String)
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Field(()=>String)
    @Column({type: "decimal", precision: 10, scale: 2, default: 0.0,transformer: new DecimalTransformer()})
    price: number;


    @Field(()=>String)
    @Column({enum: Currency,type: "enum",})
    currency: Currency;


    @Field(()=>Boolean)
    @Column({type:"bool"})
    active: boolean;

    @ManyToOne(()=>Variant,variant=>variant.prices,{lazy: true})
    variant?: Variant

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date;
}