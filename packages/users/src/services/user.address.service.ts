import { IUser } from "../models/user.model";
import debug from "debug";
import { IAddress } from "../models/adress.schema";
import INewAddressDTO from "../dto/new_address.dto";
import IPatchAddressDTO from "../dto/patch_address.dto";
const log = debug("app:services:UserService");

export class UserAddressService{
    
    async getUserAddress(user:IUser,address:string):Promise<IAddress>{
        return user.addresses.find((addr)=>addr._id == address);
    }

    async addUserAddress(user:IUser,address:INewAddressDTO){
        if(address.primary){
            this.setAllAddressesAsNonPrimary(user);
        }
        const index = user.addresses.push({...address});
        await user.save();
        return user.addresses[index-1];
    }

    async patchUserAddress(user:IUser,address:IAddress,patch:IPatchAddressDTO){
        if(patch.primary===true && address.primary===false){
            this.setAllAddressesAsNonPrimary(user);
        }
        address.set(patch);
        await user.save();
        return address;
    }
    

    async deleteUserAddress(user:IUser,address:IAddress){
        user.addresses.pull(address);
        await user.save();
    }


    private async setAllAddressesAsNonPrimary(user:IUser){
        for(const subdoc of user.addresses){
            subdoc.set({primary:false});
        }
    }
}

export default new UserAddressService();