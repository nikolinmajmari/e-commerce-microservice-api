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
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})