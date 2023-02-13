import { Application } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export class SwaggerConfig {
  constructor(app: Application, HOST: string, PORT: number) {
    const swaggerDefinition = {
      openapi: '3.0.3',
      info: {
        title: 'USERS API', 
        version: '1.0.0',
        description: 'The Users REST API', 
      },
      host: `${HOST}:${PORT}`, 
      basePath: '/', 
      components: {
        securitySchemes: {
          Bearer: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            value: "Bearer <JWT token here>"
          }
        }
      }
    };
    const options = {
      swaggerDefinition,
      apis: [__dirname + '/**/docs/*.yaml'],
    };
    const swaggerSpec = swaggerJSDoc(options);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
}
