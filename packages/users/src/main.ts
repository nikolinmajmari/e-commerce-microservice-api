/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import debug from "debug";


/// app prestart is invoked before the server is started 
import "./app/prestart";

/// start the server
const log = debug("app:entry");


import app from "./app";
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

