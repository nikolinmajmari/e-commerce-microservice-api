import { UserMetadata } from "auth0";

export interface CoreUserMetadata extends UserMetadata{
    firstName?: string;
    lastName?: string;
    gender?: "male"|"female",
    birthDate?: string,
    avatar?:string,
}