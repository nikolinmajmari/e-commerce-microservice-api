import { Field, ObjectType } from "@nestjs/graphql";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import { Attribute } from "./attribute.entity";
import { Variant } from "./variant.entity";

@Entity({ name: "variant_attribute",})
@Unique("UNIQUE_PRODUCT_ATTRIBUTE",["attribute","variant"])
@ObjectType()
export class VariantAttribute{

    @Field(()=>String)
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Field(()=>String)
    @Column({length:256})
    value:string;


    @Field(()=>String)
    @Column({length:256})
    unit: string;


    @Field(()=>Attribute,{nullable:true})
    @ManyToOne(()=>Attribute,{
        onDelete: "NO ACTION",
        lazy:true
    })
    attribute?: Attribute|Promise<Attribute>|any;


    @ManyToOne(()=>Variant,{
        
    })
    @Field(()=>Variant)
    variant?: Variant;


    @Field(()=>Date)
    @CreateDateColumn()
    createdAt: Date;



    @Field(()=>Date)
    @CreateDateColumn()
    updatedAt: Date;

}
