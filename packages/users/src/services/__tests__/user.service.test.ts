import {UserService} from "../user.service";
import mockAuth0Service from "../../tests/mock_auth0_service.spec";
import {Chance} from "chance";
import ICreateUserDTO from "../../dto/create_user.dto";
import debug from "debug";
import assert from 'node:assert';
import User from "../../models/user.model";
import { Mailer } from "../../common/mailer";
const log = debug("test");
const chance = new Chance();
const userService = new UserService(mockAuth0Service,{});

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


it("Creates an user using data from oauth0 user",async function () {
    const auth0UserId = chance.android_id();
    const createdUser = await userService.createUserFromOauthUser({
        user_id: auth0UserId,
        name: "Some Name",
        phone_number: "phone_number",
        email: "email",
        picture: "picture"
    },"Admin");
    assert.equal(createdUser.user_id ,auth0UserId);
    assert.notEqual(createdUser._id ,null);
    assert.equal(createdUser.firstName,"Some");
    assert.equal(createdUser.email,"email");
    assert.equal(createdUser.phone ,"phone_number");
});
it("Creates a new user when suplied data ",async function(){
    const user = await userService.createUser(dto);
    assert.equal(user.addresses.length,dto.addresses.length);
    assert.equal(user.firstName, dto.firstName);
    assert.notEqual(user._id , null);
    assert.notEqual(user.user_id ,null);
});
it("Updates an user data without changing unchangable props",async function (){
    const user = await userService.createUser(dto);
    const user_id  = user.user_id;
    const update = {
        firstName: chance.name(),
        email: chance.email(),
        phone: chance.phone(),
        lastName: dto.lastName,
        user_id: "some user id",
    };
    const updated = await userService.updateUser(user,update);
    assert.equal(updated.firstName,update.firstName);
    assert.equal(updated.lastName,update.lastName);
    assert.notEqual(updated.phone,dto.phone);
    assert.equal(updated.user_id , user_id);
});
it("deletes created user ",async function(){
    const user = await userService.createUser(dto);
    await userService.deleteUserAccount(user);
    const found = await User.findById(user._id);
    assert.equal(found,null);
});