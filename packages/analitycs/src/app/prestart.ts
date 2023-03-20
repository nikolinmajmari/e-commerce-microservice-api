import dotenv from "dotenv";
dotenv.config();

import emitter from "../common/event_emitter.service";
emitter.configure();

import mongooseService from "../common/mongoose.service";
mongooseService.connect();
