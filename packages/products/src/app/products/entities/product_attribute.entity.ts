import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Attribute } from "./attribute.entity";
import { Variant } from "./variant.entity";

@Entity({ name: "variant_attribute",})
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
