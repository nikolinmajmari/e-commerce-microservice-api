import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Variant } from "./variant.entity";

export enum Currency {
    USD = "USD",
    EUR="EUR",
    ALL="ALL",
}

@Entity({name: "variant_price"})
export class VariantPrice{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    price: number;

    @Column({enum: Currency,type: "enum",})
    currency: Currency;

    @Column({type:"bool"})
    active: boolean;

    @ManyToOne(()=>Variant,variant=>variant.prices)
    variant: Variant

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date;
}