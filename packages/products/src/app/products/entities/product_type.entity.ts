import { ObjectType } from "@nestjs/graphql";
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
    id: string;

    @Column({nullable: false,unique: true})
    name: string;

    @OneToMany(()=>Attribute,attribute=>attribute.productType,{
        cascade: true,
        lazy: true,
        onDelete: 'CASCADE' 
    })
    attributes:Attribute[];

    @OneToMany(()=>Product,product=>product.type,{
        onDelete: "RESTRICT"
    })
    products:Product[];

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}
