import Log from "../model/log.model";

export class LogService{

    async getLogs(){
        return await Log().find({}).sort({_id: "descending"});
    }

    async deleteLogs(){
        return await Log().deleteMany({})
    }
}


export default new LogService();