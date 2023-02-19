import HttpErrorType from "./http.errors.type";
import HttpError from "./http.errors";


export default class NotFound extends HttpError{
    constructor(message:string){
        super()
        this.message = message;
        this.status = 404;
        this.type = HttpErrorType.HTTP_404;
    }
}