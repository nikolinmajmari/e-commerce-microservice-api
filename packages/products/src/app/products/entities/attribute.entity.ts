import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { VariantAttribute } from "./product_attribute.entity";
import { ProductType } from "./product_type.entity";

export enum AttributeType{
    INT="INT",
    FLOAT="FLOAT",
    TEXT="TEXT",
}


@Entity({ name: "attribute",})
export class Attribute{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    name: string;

    @Column({type: "enum",enum:[AttributeType.FLOAT,AttributeType.INT,AttributeType.TEXT]})
    type: string;

    @Column({type: "bool",default: true})
    searchable:boolean;

    @Column({type: "bool",default: true})
    required: boolean;

    @CreateDateColumn()
    createdAt: Date;

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
