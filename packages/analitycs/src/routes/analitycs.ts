import { Application } from "express";
import auth from "../common/auth";
import analitycsController from "../controller/analitycs.controller";

export default class AnalitycsRoute {

    constructor(
        private app:Application
    ){
        this.configureRoutes();
    }

    configureRoutes(){
        this.app.use(
            "/analitycs",
            auth()
        );
        this.app.route("/analitycs/logs")
        .get(analitycsController.getLogs);

    }
}