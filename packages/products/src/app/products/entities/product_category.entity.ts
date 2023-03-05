import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: "category"})
export class Category{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false,unique: true})
    name: string;

    @Column({type: "text"})
    description:string;
    
    @ManyToMany(()=>Product)
    @JoinTable()
    products:Product[]

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}
