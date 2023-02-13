/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import "./app/prestart";
import app from "./app";
import debug from "debug";
const log = debug("app:entry");
log("invoked listening on ",process.env.PORT);
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

