import { AppError } from "./app_error";

export default class OAuth0ApiError extends AppError{
    constructor(message: string,error: any){
        super("OAUTH API Error",message,);
        this.error = error;
    }
}