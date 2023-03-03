import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { VariantEntity } from "./variant.entity";


@Entity({
    name: "products",
})
export class ProductEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false,unique: true})
    name: string;

    @Column()
    status: string;
    
    @OneToMany(()=>VariantEntity,variant=>variant.product)
    variants: VariantEntity[]

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}