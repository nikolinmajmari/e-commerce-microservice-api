import { AppError } from "../app_error";
import HttpErrorType from "./http.errors.type";

export default class HttpError extends AppError{ 
    status:number;
    type?: HttpErrorType;
    constructor(error?:unknown){
        super("HttpError","An http exception occured");
        this.error = error;
    }

    toHttpError(){
        return this;
    }

    toJson(){
        return {
            ...this
        };
    }
}