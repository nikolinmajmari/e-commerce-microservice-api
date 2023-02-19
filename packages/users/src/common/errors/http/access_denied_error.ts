import HttpErrorType from "./http.errors.type";
import HttpError from "./http.errors";


export default class AccessDenied extends HttpError{
    constructor(message:string){
        super()
        this.message = message;
        this.type = HttpErrorType.HTTP_403;
    }
}