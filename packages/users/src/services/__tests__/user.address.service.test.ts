import { UserAddressService } from "../user.address.service";
import {Chance} from "chance";
import ICreateUserDTO from "../../dto/create_user.dto";
import debug from "debug";
import assert from 'node:assert';
import User from "../../models/user.model";
import { domainToASCII } from "node:url";
const log = debug("test");
const chance = new Chance();
const dto:ICreateUserDTO= {
    firstName: chance.name(),
    lastName: chance.name(),
    email: chance.email(),
    addresses:[{
        address:chance.address(),
        label: chance.name(),
        postalCode:chance.integer({min:1000,max:1900}).toString(),
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
};
const addressDto = {
    address:chance.address(),
    label: chance.name(),
    postalCode:chance.integer({min:1000,max:1900}).toString(),
    city: chance.city(),
    primary: true,
    state: chance.state()
};
const service = new UserAddressService();

async function mockUser(){
    const user = User.build(dto);
    await user.save();
    return user;
}
it("Gets certain user addresses",async function(){
    /// create an user 
    const user = await mockUser();
    const addresses = user.addresses;
    const address = await service.getUserAddress(user,addresses[0]._id);
    assert.equal(address.label,dto.addresses[0].label);
    assert.equal(user.addresses.length,dto.addresses.length);
    ///assert.equal(address.address,dto.addresses[0].address);
    assert.equal(address.postalCode,dto.addresses[0].postalCode);
    assert.equal(address.city,dto.addresses[0].city);
    assert.equal(address.primary,dto.addresses[0].primary);

});

it("Adds an address to an user",async function(){
    const user = await mockUser();
    assert.equal(user.addresses.length,dto.addresses.length);
    const created = await service.addUserAddress(user,addressDto);
    assert.notEqual(created._id,null);
    assert.equal(dto.addresses.length+1,user.addresses.length);
    assert.equal(user.addresses[1].label,addressDto.label)
    assert.equal(user.addresses[1].primary,addressDto.primary)
    assert.equal(user.addresses[1].city,addressDto.city)
})