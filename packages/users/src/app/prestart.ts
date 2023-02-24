/// initialize mongoose 
import mongoservice from "../common/mongoose";
import emmiter from "../common/emmiter";
/// configure env variables
import * as dotenv from 'dotenv';

/// configure process env variable
dotenv.config()

/// initialize mongoodb connection
mongoservice.connect();

///

emmiter.configure();