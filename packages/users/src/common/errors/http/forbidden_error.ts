import HttpErrorType from "./http.errors.type";
import HttpError from "./http.errors";


export default class Forbidden extends HttpError{
    constructor(message:string){
        super()
        this.message = message;
        this.status = 401;
        this.type = HttpErrorType.HTTP_401;
    }
}