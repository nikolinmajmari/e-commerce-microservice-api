import getLogModel, { ILogModel } from "../model/log.model";

export class LogService{

    get model() { return getLogModel();}
    
    async getLogs(){
        return this.model.find({});
    }
    /**
     * 
     * @returns 
     */
    async deleteMany(){
        await this.model.deleteMany({});
    }
}


export default new LogService();