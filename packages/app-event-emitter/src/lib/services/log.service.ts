import Log from "../model/log.model";

export class LogService{

    async getLogs(){
        return await Log().find({}).sort({_id: "descending"});
    }
}


export default new LogService();