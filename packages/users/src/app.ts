import express from 'express';
import * as path from 'path';
import UsersRoute from './routes/users.route';
import debug from "debug";
import helmet from 'helmet';
import { SwaggerConfig } from './swagger.config';
const log = debug("app:main");

export const PORT = +process.env.PORT || 3333;
export const HOST = process.env.HOST || 'localhost';

const app = express();
app.use(helmet());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

/// configure swagger 
new SwaggerConfig(app, HOST, PORT);
/// inject users route 
new UsersRoute(app);

app.get('/api', (req, res) => {
    res.send({message: 'Welcome to users!'});
});

log(`Routes configured and Swagger served at http://${HOST}:${PORT}/docs`)

export default app;