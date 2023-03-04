import express from 'express';
import * as path from 'path';
import debug from "debug";
import helmet from 'helmet';
import { SwaggerConfig } from './swagger.config';
import AuthRoutes from './common/auth/auth.routes';
import { AuthConfigService } from './common/auth/auth.config';
import AppErrorHandler from './common/errors/errors.service';
import ApiUserRoute from './routes/api.user.route';
import ApiUsersRoute from './routes/api.users.route';
import AnalitycsRoute from './routes/api.analitycs';
import analitycsMiddleware from './middleware/analitycs/analitycs.middleware';
import { identifierMidleware } from '@repo/app-event-emitter';
const log = debug("app:main");

export const PORT = +process.env.PORT || 3333;
export const HOST = process.env.HOST || 'localhost';
const app = express();
app.use(helmet());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(identifierMidleware);
app.use(analitycsMiddleware);
/// auth config and routes 
(new AuthConfigService(app)).config();
new AuthRoutes(app);
/// config auth 
new AnalitycsRoute(app);
/// configure swagger 
new SwaggerConfig(app, HOST, PORT);
/// inject users route

new ApiUserRoute(app); 
new ApiUsersRoute(app);

/// configure error handler 
new AppErrorHandler(app);

log(`Routes configured and Swagger served at http://${HOST}:${PORT}/docs`)

export default app;