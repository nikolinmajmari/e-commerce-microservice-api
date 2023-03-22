import { Field, ObjectType } from "@nestjs/graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import { VariantAttribute } from "./product_attribute.entity";
import { ProductType } from "./product_type.entity";

export enum AttributeType{
    INT="INT",
    FLOAT="FLOAT",
    TEXT="TEXT",
}


@ObjectType()
@Entity({ name: "attribute",})
@Unique("UNIQUE_PRODUCT_TYPE_ATTRIBUTE_CONSTRAINT",["productType","name"])
export class Attribute{


    @Field(()=>String)
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Field(()=>String)
    @Column({nullable: false})
    name: string;


    @Field(()=>String)
    @Column({type: "enum",enum:[AttributeType.FLOAT,AttributeType.INT,AttributeType.TEXT]})
    type: string;


    @Field(()=>Boolean)
    @Column({type: "bool",default: true})
    searchable:boolean;


    @Field(()=>Boolean)
    @Column({type: "bool",default: true})
    required: boolean;


    @Field(()=>Date)
    @CreateDateColumn()
    createdAt: Date;


    @Field(()=>Date)
    @CreateDateColumn()
    updatedAt: Date;

    @ManyToOne(()=>ProductType,type=>type.attributes,{
        orphanedRowAction:"delete",
    })
    productType: ProductType;

    @OneToMany(
        ()=>VariantAttribute,productAttribute=>productAttribute.attribute)
    variantAttributes:VariantAttribute[];
}
