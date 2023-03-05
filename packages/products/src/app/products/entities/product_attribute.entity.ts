import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Attribute } from "./attribute.entity";
import { Product } from "./product.entity";

@Entity({ name: "product_attribute",})
export class ProductAttribute{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length:256})
    value:string;

    @Column({length:256})
    unit: string;

    @ManyToOne(()=>Attribute)
    attribute: Attribute;

    @ManyToOne(()=>Product)
    product: Product;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}
