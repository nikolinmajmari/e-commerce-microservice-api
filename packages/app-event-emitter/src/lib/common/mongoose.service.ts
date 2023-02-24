import * as mongoose from 'mongoose';
import debug from 'debug';

const log = debug('package:app-event-emmiter:mongoose');

class MongooseService {

  private connection :mongoose.Connection;

  async connect(mongooseURL:string) {
    log('Connecting to Mongoose for loggging');
    this.connection = await mongoose.createConnection(mongooseURL);
    log('Connected to Mongoose for logging');
  }

  async disconnect() {
    await this.connection.close();
  }

  getConnection(){
    return this.connection;
  }

}
export default new MongooseService();
