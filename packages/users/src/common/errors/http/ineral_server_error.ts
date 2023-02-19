import HttpErrorType from "./http.errors.type";
import HttpError from "./http.errors";


export default class InternalServerError extends HttpError{
    constructor(previous: any){
        super()
        this.message = "An internal error occured!";
        this.type = HttpErrorType.HTTP_500;
        this.error = previous;
    }
}