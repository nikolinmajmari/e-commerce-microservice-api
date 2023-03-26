import { Field, ObjectType } from "@nestjs/graphql";
import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { CommonEntity } from "../../common/common.entity";
import { Attribute } from "./attribute.entity";
import { Product } from "./product.entity";

@Entity({
    name: "product_type",
})
@ObjectType()
export class ProductType extends CommonEntity{
    @PrimaryGeneratedColumn("uuid")
    @Field(()=>String)
    id: string;

    @Column({nullable: false,unique: true})
    @Field(()=>String)
    name: string;

    @OneToMany(()=>Attribute,attribute=>attribute.productType,{
        cascade: true,
        lazy: true,
        onDelete: 'CASCADE' 
    })
    @Field(()=>[Attribute])
    attributes?:Attribute[]|Promise<Attribute[]>;

    @OneToMany(()=>Product,product=>product.type,{
        onDelete: "RESTRICT"
    })
    products?:Product[];

    @CreateDateColumn()
    @Field(()=>Date)
    createdAt: Date;

    @CreateDateColumn()
    @Field(()=>Date)
    updatedAt: Date;

}
