import * as mongoose from 'mongoose';
import * as debug from 'debug';

const log = debug('app:mongoose');
const mongooseURL = process.env.MONGODB_URL || 'mongodb://localhost/users-repository';

class MongooseService {
  async connect() {
    log('Connecting to Mongoose');
    await mongoose.connect(mongooseURL);
    log('Connected to Mongoose');
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  getMongoose(){
    return mongoose;
  }

}
export default new MongooseService();
