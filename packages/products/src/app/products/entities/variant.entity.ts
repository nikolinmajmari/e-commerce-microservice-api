import { Field, Int, ObjectType,Float } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { VariantAttribute } from "./product_attribute.entity";
import { VariantPrice } from "./variant_price.entity";

@Entity({name: "variant"})
@ObjectType()
export class Variant{


    @Field(()=>String)
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Field(()=>String)
    @Column()
    sku: string;


    @Field(()=>String)
    @Column()
    title: string;


    @Field(()=>[String])
    @Column({type:"text",array: true})
    images: string[];


    @Field(()=>Boolean)
    @Column({type:"bool",default: true})
    main: boolean;


    @Field(()=>Int)
    @Column({type: "int",default:0})
    stock: number


    @Field(()=>[VariantAttribute])
    @OneToMany(()=>VariantAttribute,
    attribute=>attribute.variant,{
        lazy: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    attributes:VariantAttribute[]


    @Field(()=>[VariantPrice])
    @OneToMany(()=>VariantPrice,price=>price.variant,{
        cascade: true,
        onDelete: "CASCADE",
        lazy: true
    })
    prices: VariantPrice[]

    @ManyToOne(()=>Product,product=>product.variants,{
        lazy: true
    })
    product: Product

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date;
}