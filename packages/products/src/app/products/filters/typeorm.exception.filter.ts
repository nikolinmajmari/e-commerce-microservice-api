import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { TypeOrmCodes } from './typeorm.codes';

@Catch(EntityNotFoundError)
export class TypeOrmNotFOundErrorFilter implements ExceptionFilter {
  catch(err: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response
        .status(HttpStatus.NOT_FOUND)
        .json({
            statusCode: HttpStatus.NOT_FOUND,
            timestamp: new Date().toISOString(),
            message: "Not Found",
            path: request.url,
        });
  }
}

@Catch(QueryFailedError)
export class TypeOrmUniqueConstraintVoilationFilter extends BaseExceptionFilter{
    catch(exception: QueryFailedError|any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const detail = exception.detail;
        if (typeof detail === 'string' && detail.includes('already exists') 
        && exception.code == TypeOrmCodes.UniqueConstraintVoilation) {
            const messageStart = exception.table.split('_').join(' ') + ' with';
            return response.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                message:  exception.detail.replace('Key', messageStart),
                error: "Conflict"
            })
        }
        super.catch(exception,host);
    }
    
}