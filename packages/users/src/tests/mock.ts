import User from "../models/user.model";
import { Chance } from "chance";
const chance = new Chance();
export async function mockUser(){
    const user = User.build({
        firstName: chance.name(),
        lastName: chance.name(),
        email: chance.email(),
        addresses:[{
            address:chance.address(),
            label: chance.name(),
            postalCode:chance.integer({min:1000,max:1900}),
            city: chance.city(),
            primary: true,
            state: chance.state()
        }],
        avatar:chance.url(),
        birdhDate: chance.birthday().toString(),
        gender:"male",
        password:chance.hash(),
        permissionLevel:chance.bool()?"Admin":"User",
        phone:chance.phone(),
        status:"active",
        username: chance.email(),
    });
    user.user_id = chance.android_id()
    await user.save();
    return user;
}