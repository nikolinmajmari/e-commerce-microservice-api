/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import AnalitycsRoute from './routes/analitycs';
import "./app/prestart";
import debug from "debug";
import { SwaggerConfig } from './swagger.config';
const log = debug("app:main");
export const PORT = +process.env.PORT || 3333;
export const HOST = process.env.HOST || 'localhost';
const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

new SwaggerConfig(app,HOST,PORT);

new AnalitycsRoute(app);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to analitycs!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
