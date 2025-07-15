import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let message: string;
        let error: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();

            if (typeof errorResponse === 'object' && errorResponse !== null) {
                message = (errorResponse as any).message || exception.message;
                error = (errorResponse as any).error || exception.name;
            } else {
                message = errorResponse as string;
                error = exception.name;
            }
        } else {
            // Erro não tratado
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Erro interno do servidor';
            error = 'Internal Server Error';

            // Log do erro completo para debugging
            this.logger.error(
                `Unhandled exception: ${exception}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        }

        // Log do erro para monitoramento
        this.logger.error(
            `HTTP ${status} Error: ${message} - ${request.method} ${request.url}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        // Resposta padronizada
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
        });
    }
}
