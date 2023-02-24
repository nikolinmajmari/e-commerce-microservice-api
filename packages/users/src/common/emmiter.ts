import { AppEventEmitter } from "@repo/app-event-emitter";

const mongooseURL = process.env.MONGODB_URL || 'mongodb://localhost/logs-repository';


const emmiter = new AppEventEmitter({
    mongooseUrl: mongooseURL
});



export default emmiter;