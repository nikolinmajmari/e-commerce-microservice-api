import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import { Attribute } from "./attribute.entity";
import { Variant } from "./variant.entity";

@Entity({ name: "variant_attribute",})
@Unique("UNIQUE_PRODUCT_ATTRIBUTE",["attribute","variant"])
export class VariantAttribute{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length:256})
    value:string;

    @Column({length:256})
    unit: string;

    @ManyToOne(()=>Attribute)
    attribute: Attribute;

    @ManyToOne(()=>Variant)
    variant: Variant;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}
