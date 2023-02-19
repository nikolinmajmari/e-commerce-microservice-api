
export class AppError implements Error{
    constructor(public name:string,public message:string,public stack?:string,public error?:any){
    }
    status = 500;
    
    toJson(){
        return {
           ...this
        }
    }
}