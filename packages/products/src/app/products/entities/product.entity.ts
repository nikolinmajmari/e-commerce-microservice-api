import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Category } from "./product_category.entity";
import { ProductType } from "./product_type.entity";
import { Variant } from "./variant.entity";

export enum ProductStatus{
    ACTIVE="active",
    INACTIVE="inActive",
}

@Entity({
    name: "product",
})
export class Product{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false,unique: true})
    name: string;

    @Column({type: "enum",enum:[ProductStatus.ACTIVE,ProductStatus.INACTIVE]})
    status: string;

    @Column({type: "text",array: true,nullable:true})
    tags?: string[];

    @Column({type:"text",array: true})
    images: string[];

    @ManyToOne(()=>ProductType,type=>type.products)
    type: ProductType;
    
    @OneToMany(()=>Variant,variant=>variant.product)
    variants: Variant[];

    @ManyToMany(()=>Category)
    @JoinTable()
    categories:Category[];

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}
