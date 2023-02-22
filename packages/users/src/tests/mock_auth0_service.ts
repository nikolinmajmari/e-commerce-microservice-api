import { User, AppMetadata, UserMetadata, PasswordChangeTicketResponse, EmailVerificationTicketOptions } from "auth0";
import { randomBytes } from "crypto";
import { IAuth0Service, IAuth0UserType } from "../common/auth/auth.types";
import { IPermissionLevel } from "../models/user.model";

export class MockAuth0Service implements IAuth0Service{
    async findUserByEmail(email: string): Promise<User<AppMetadata, UserMetadata>> {
        return {
            email: email,
            user_id: randomBytes(30).toString("utf-8")
        };
    }
    async updateUser(auth0UserId: string, update: IAuth0UserType, role?: IPermissionLevel) {
        return;
    }
    async createUser(user: IAuth0UserType): Promise<User<AppMetadata, UserMetadata>> {
        return {
            user_id: randomBytes(30).toString("utf-8")
        };
    }
    async assignRoleToUser(auth0UserId: string, userRole: string) {
        return;
    }
    async createPassowrdResetTicket({ user_id, connection_id, email }: { user_id?: string; connection_id?: string; email: string; }): Promise<PasswordChangeTicketResponse> {
       return { ticket: "some ticket"}
    }
    async createEmailVerificationTicket({ user_id }: { user_id: string; }): Promise<EmailVerificationTicketOptions> {
       return {result_url:"SOME URL",user_id};
    }
    async findAndRemoveUserByEmail(email: string) {
        return;
    }
    
}

export default new MockAuth0Service();