import {Document, Schema } from "mongoose";

export interface IAddress extends Document{
    address:string,
    city:string,
    postalCode:string,
    state:string,
    primary:boolean,
    label:string,
}


export default new Schema({
    adress: String,
    city: String,
    postalCode: String,
    state: String,
    primary: Boolean,
    label: String,
})