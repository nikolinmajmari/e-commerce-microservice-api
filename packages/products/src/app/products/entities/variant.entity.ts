import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity({name: "variant"})
export class VariantEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    sku: string;

    @Column()
    title: string;

    @Column()
    weight: number;

    @Column()
    weight_unit: string;

    @ManyToOne(()=>ProductEntity,product=>product.variants)
    product: ProductEntity

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date;
}