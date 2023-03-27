import { Field, ObjectType } from "@nestjs/graphql";
import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId} from "typeorm";
import { Category } from "./category.entity";
import { ProductType } from "./product_type.entity";
import { Variant } from "./variant.entity";

export enum ProductStatus{
    ACTIVE="active",
    INACTIVE="inActive",
}

@Entity({
    name: "product",
})
@ObjectType()
export class Product{

    @Field(()=>String)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field(()=>String)
    @Column({nullable: false,unique: true})
    name: string;

    @Field(()=>String)
    @Column({type: "enum",enum:[ProductStatus.ACTIVE,ProductStatus.INACTIVE]})
    status: string;


    @Field(()=>[String])
    @Column({type: "text",array: true,nullable:true})
    tags?: string[];


    @Field(()=>[String])
    @Column({type:"text",array: true})
    images: string[];


    @ManyToOne(()=>ProductType,type=>type.products,{
        lazy: true,
        nullable: false,
    })
    @Field(()=>ProductType)
    type: ProductType|Promise<ProductType>|any;
    

    @Field(()=>[Variant])
    @OneToMany(()=>Variant,variant=>variant.product,{
        lazy: true,
        cascade:true
    })
    variants: Variant[]|Promise<Variant[]>;

    @ManyToMany(()=>Category,{
        lazy: true
    })
    @JoinTable()
    categories:Category[]|Promise<Category[]>;


    @Field(()=>Date)
    @CreateDateColumn()
    createdAt: Date;


    @Field(()=>Date)
    @CreateDateColumn()
    updatedAt: Date;

}
