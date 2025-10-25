// Cloudflare Workers logging utility
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
    requestId?: string;
    userId?: string;
    endpoint?: string;
    method?: string;
    userAgent?: string;
    ip?: string;
    [key: string]: any;
}

class Logger {
    private isProduction: boolean;

    constructor(isProduction: boolean = false) {
        this.isProduction = isProduction;
    }

    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const baseLog = {
            timestamp,
            level,
            message,
            ...context,
        };

        return JSON.stringify(baseLog);
    }

    private log(level: LogLevel, message: string, context?: LogContext): void {
        const formattedMessage = this.formatMessage(level, message, context);

        switch (level) {
            case 'debug':
                if (!this.isProduction) {
                    console.debug(formattedMessage);
                }
                break;
            case 'info':
                console.log(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'error':
                console.error(formattedMessage);
                break;
        }
    }

    debug(message: string, context?: LogContext): void {
        this.log('debug', message, context);
    }

    info(message: string, context?: LogContext): void {
        this.log('info', message, context);
    }

    warn(message: string, context?: LogContext): void {
        this.log('warn', message, context);
    }

    error(message: string, context?: LogContext): void {
        this.log('error', message, context);
    }

    // Request logging helpers
    requestStart(method: string, url: string, context?: LogContext): void {
        this.info('Request started', {
            ...context,
            method,
            url,
            endpoint: url,
        });
    }

    requestEnd(method: string, url: string, status: number, duration: number, context?: LogContext): void {
        this.info('Request completed', {
            ...context,
            method,
            url,
            endpoint: url,
            status,
            duration,
        });
    }

    requestError(method: string, url: string, error: Error, context?: LogContext): void {
        this.error('Request failed', {
            ...context,
            method,
            url,
            endpoint: url,
            error: error.message,
            stack: error.stack,
        });
    }

    // Authentication logging helpers
    authAttempt(userId?: string, context?: LogContext): void {
        this.info('Authentication attempt', {
            ...context,
            userId,
        });
    }

    authSuccess(userId: string, context?: LogContext): void {
        this.info('Authentication successful', {
            ...context,
            userId,
        });
    }

    authFailure(reason: string, context?: LogContext): void {
        this.warn('Authentication failed', {
            ...context,
            reason,
        });
    }

    authLogout(userId?: string, context?: LogContext): void {
        this.info('User logged out', {
            ...context,
            userId,
        });
    }

    // WorkOS specific logging
    workosCallback(code: string, context?: LogContext): void {
        this.debug('WorkOS callback received', {
            ...context,
            hasCode: !!code,
        });
    }

    workosAuthSuccess(user: any, context?: LogContext): void {
        this.info('WorkOS authentication successful', {
            ...context,
            userId: user?.id,
            userEmail: user?.email,
        });
    }

    workosAuthError(error: Error, context?: LogContext): void {
        this.error('WorkOS authentication error', {
            ...context,
            error: error.message,
            stack: error.stack,
        });
    }

    // Cookie operations
    cookieSet(name: string, options: any, context?: LogContext): void {
        this.debug('Cookie set', {
            ...context,
            cookieName: name,
            cookieOptions: options,
        });
    }

    cookieGet(name: string, found: boolean, context?: LogContext): void {
        this.debug('Cookie retrieved', {
            ...context,
            cookieName: name,
            found,
        });
    }

    cookieDelete(name: string, context?: LogContext): void {
        this.debug('Cookie deleted', {
            ...context,
            cookieName: name,
        });
    }
}

// Create logger instance
let logger: Logger;

export function createLogger(isProduction: boolean = false): Logger {
    logger = new Logger(isProduction);
    return logger;
}

export function getLogger(): Logger {
    if (!logger) {
        logger = new Logger(false);
    }
    return logger;
}

// Request context helper
export function createRequestContext(request: Request, env?: any): LogContext {
    const url = new URL(request.url);
    return {
        requestId: crypto.randomUUID(),
        method: request.method,
        endpoint: url.pathname,
        userAgent: request.headers.get('User-Agent') || undefined,
        ip: request.headers.get('CF-Connecting-IP') ||
            request.headers.get('X-Forwarded-For') ||
            request.headers.get('X-Real-IP') || undefined,
        host: url.hostname,
        environment: env?.NODE_ENV || 'development',
    };
}
