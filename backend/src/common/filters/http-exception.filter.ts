import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_MESSAGES } from '../../shared/constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || ERROR_MESSAGES.INTERNAL_ERROR,
      error: exception.name,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.message = ERROR_MESSAGES.INTERNAL_ERROR;
    }

    response.status(status).json(errorResponse);
  }
} 