import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { VariantPrice } from "./variant_price.entity";

@Entity({name: "variant"})
export class Variant{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    sku: string;

    @Column()
    title: string;

    @Column({type:"text",array: true})
    images: string[];

    @Column({type: "int",default:0})
    stock: number

    @Column()
    weight: number;

    @Column()
    weight_unit: string;

    @OneToMany(()=>VariantPrice,price=>price.variant)
    prices: VariantPrice[]

    @ManyToOne(()=>Product,product=>product.variants)
    product: Product

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date;
}