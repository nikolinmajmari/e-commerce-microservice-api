import { PasswordChangeTicketResponse } from "auth0";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { IUser } from "../models/user.model";

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_ACCOUNT,
      pass: process.env.MAILER_SECRET,
    },
});

export class Mailer{
    constructor(private transport:nodemailer.Transporter<SMTPTransport.SentMessageInfo>){}

    async sentPasswordResetEmail(user:IUser,ticket:PasswordChangeTicketResponse){
        const sentMail =  this.transport.sendMail({
            to:user.email,
            from: process.env.MAILER_FROM,
            subject: "Password Reset Link For Incremental Project Account",
            html: `
            <body>
                <p>
                    Dear ${user.fullName}. You have requested for a password reset. Reset your password 
                    on link below. Keep in mind that link has a 10 minutes validity. 

                    <a href="${ticket.ticket}">
                    Reset Password
                    </a>
                <p>
            <body>
            `});
        return Promise.race([
            sentMail,
            new Promise((resolve, reject) => setTimeout(() => reject(new Error("could not sent mail")), 5000))
        ])
    }

}


export default new Mailer(transport);


