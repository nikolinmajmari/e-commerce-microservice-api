import { Application } from "express";
import {logController} from "@repo/app-event-emitter";
export default class AnalitycsRoute{
   
    constructor(private app:Application,private prefix="/api"){
        this.configureRoutes();
    }

    configureRoutes(){
        //// all routes need oauth authentication
        //// only users who have role user can access this account
        this.app.route('/api/v1/analitycs')
        .get(logController.default.getLogs);
    }
}