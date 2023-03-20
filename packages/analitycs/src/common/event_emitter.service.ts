import { AppEventEmitter } from "@repo/app-event-emitter";
import log_analitycsService from "../service/log_analitycs.service";
import kafka from "./kafka";

const emitter = new AppEventEmitter(kafka);
//// setup the listeners 


class EventEmitterService {

    constructor(
        private emitter:AppEventEmitter
    ){
    }

    /**
     * Setup the event listeners 
     */
    configure(){
        this.emitter.consumeAppRequestEvent(
            log_analitycsService.saveRequestLog
        );
        this.emitter.consumeAppActionEvent(
            log_analitycsService.saveActionLog
        )
    }
}

export default new EventEmitterService(emitter);