import HttpErrorType from "./http.errors.type";
import HttpError from "./http.errors";


export default class Conflict extends HttpError{
    constructor(message: string,previous:any){
        super()
        this.message = message;
        this.error = previous;
        this.status = 409;
        this.type = HttpErrorType.HTTP_409;
    }
}