import { Response,Request, Application } from "express";
import debug from "debug";
import NotFound from "./http/not_found.error.";
import errorHandlerMidleware from "./middleware/error_handler.middleware";

const log = debug("app:main:errorHandler:service");

export default class AppErrorHandler{

    app:Application;

    constructor(app:Application){
        this.app = app;
        this.configure();
    }

    
    configure(){
        this.app.use((req,res,next)=>{
            next(new NotFound(`Can not ${req.method} on ${req.url}`));
        });
        this.app.use(errorHandlerMidleware);
        log("Configured error handler service");
    }
}