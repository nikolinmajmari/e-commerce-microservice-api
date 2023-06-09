import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { error } from 'console';
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
            description: err.message
        });
  }
}

@Catch(QueryFailedError)
export class TypeOrmUniqueConstraintVoilationFilter implements ExceptionFilter {
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
        else if(typeof detail === 'string' && detail.includes("is not present in table")){
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message:  exception.detail.replace('Key', ""),
                error: "BAD REQUEST"
            })
        }
        else{
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message:"internal server error",
                code: exception.code,
                ...exception
            })
        }
    }
}

@Catch(Error)
export class GraphqlErrorHandler implements GqlExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    return exception;
  }
}