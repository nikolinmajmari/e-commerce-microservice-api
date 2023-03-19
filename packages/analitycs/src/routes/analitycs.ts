import { Application } from "express";
import analitycsController from "../controller/analitycs.controller";

export default class AnalitycsRoute {

    constructor(
        private app:Application
    ){
        this.configureRoutes();
    }

    configureRoutes(){
        this.app.route("/analitycs")
        .get(analitycsController.getLogs);

    }
}