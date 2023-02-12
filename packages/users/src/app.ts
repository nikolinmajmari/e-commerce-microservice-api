import express from 'express';
import * as path from 'path';
import UsersRoute from './routes/users.route';
import debug from "debug";

const log = debug("app:main");

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

/// inject users route 
new UsersRoute(app);

app.get('/api', (req, res) => {
    res.send({message: 'Welcome to users!'});
});

log("configured all routes");

export default app;