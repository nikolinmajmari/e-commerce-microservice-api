import HttpErrorType from "./http.errors.type";
import HttpError from "./http.errors";


export default class BadRequest extends HttpError{
    constructor(error){
        super()
        this.name = "Bad Request";
        this.message = error.message??"Request submited was invlaid";
        this.type = HttpErrorType.HTTP_400;
        this.status = 400;
        this.error = error;
    }
}