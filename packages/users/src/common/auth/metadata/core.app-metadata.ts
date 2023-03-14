import { AppMetadata } from "auth0";
import { IPermissionLevel, IAccountStatus } from "../../../models/user.model";

export interface CoreAppMetadata extends AppMetadata{
    id?: string;
    permissionLevel?: IPermissionLevel,
    phone?:string;
    username?:string;
    status?:IAccountStatus
}