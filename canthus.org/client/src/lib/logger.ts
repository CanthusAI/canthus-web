// Client-side logging utility for Cloudflare Pages
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
    userId?: string;
    endpoint?: string;
    component?: string;
    action?: string;
    [key: string]: any;
}

class ClientLogger {
    private isProduction: boolean;
    private isDevelopment: boolean;

    constructor() {
        this.isProduction = import.meta.env.PROD;
        this.isDevelopment = import.meta.env.DEV;
    }

    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const baseLog = {
            timestamp,
            level,
            message,
            environment: this.isProduction ? 'production' : 'development',
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...context,
        };

        return JSON.stringify(baseLog);
    }

    private log(level: LogLevel, message: string, context?: LogContext): void {
        const formattedMessage = this.formatMessage(level, message, context);

        // In development, use console methods for better debugging
        if (this.isDevelopment) {
            switch (level) {
                case 'debug':
                    console.debug(formattedMessage);
                    break;
                case 'info':
                    console.info(formattedMessage);
                    break;
                case 'warn':
                    console.warn(formattedMessage);
                    break;
                case 'error':
                    console.error(formattedMessage);
                    break;
            }
            return;
        }

        // In production, send to Cloudflare Pages analytics/logging
        // This will be captured by Cloudflare Pages and visible in the dashboard
        switch (level) {
            case 'debug':
                // Debug logs are not sent in production
                break;
            case 'info':
                console.log(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'error':
                console.error(formattedMessage);
                // For critical errors, you might want to send to an external service
                this.sendToAnalytics('error', message, context);
                break;
        }
    }

    private async sendToAnalytics(event: string, message: string, context?: LogContext): Promise<void> {
        try {
            // You can integrate with external analytics services here
            // For now, we'll just use console.error which Cloudflare Pages will capture
            console.error(`[ANALYTICS] ${event}:`, message, context);
        } catch (error) {
            // Silently fail - we don't want logging errors to break the app
            console.debug('Failed to send analytics event:', error);
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

    // Authentication logging helpers
    authAttempt(context?: LogContext): void {
        this.info('Authentication attempt started', {
            ...context,
            action: 'auth_attempt',
        });
    }

    authSuccess(userId: string, context?: LogContext): void {
        this.info('Authentication successful', {
            ...context,
            userId,
            action: 'auth_success',
        });
    }

    authFailure(reason: string, context?: LogContext): void {
        this.warn('Authentication failed', {
            ...context,
            reason,
            action: 'auth_failure',
        });
    }

    authLogout(userId?: string, context?: LogContext): void {
        this.info('User logged out', {
            ...context,
            userId,
            action: 'auth_logout',
        });
    }

    // API request logging helpers
    apiRequest(method: string, url: string, context?: LogContext): void {
        this.debug('API request initiated', {
            ...context,
            method,
            url,
            action: 'api_request',
        });
    }

    apiResponse(method: string, url: string, status: number, duration: number, context?: LogContext): void {
        this.info('API request completed', {
            ...context,
            method,
            url,
            status,
            duration,
            action: 'api_response',
        });
    }

    apiError(method: string, url: string, error: Error, context?: LogContext): void {
        this.error('API request failed', {
            ...context,
            method,
            url,
            error: error.message,
            action: 'api_error',
        });
    }

    // Navigation logging helpers
    navigation(from: string, to: string, context?: LogContext): void {
        this.info('Navigation occurred', {
            ...context,
            from,
            to,
            action: 'navigation',
        });
    }

    // Component lifecycle logging helpers
    componentMount(component: string, context?: LogContext): void {
        this.debug('Component mounted', {
            ...context,
            component,
            action: 'component_mount',
        });
    }

    componentUnmount(component: string, context?: LogContext): void {
        this.debug('Component unmounted', {
            ...context,
            component,
            action: 'component_unmount',
        });
    }

    componentError(component: string, error: Error, context?: LogContext): void {
        this.error('Component error', {
            ...context,
            component,
            error: error.message,
            stack: error.stack,
            action: 'component_error',
        });
    }

    // Performance logging helpers
    performance(metric: string, value: number, context?: LogContext): void {
        this.info('Performance metric', {
            ...context,
            metric,
            value,
            action: 'performance',
        });
    }

    // User interaction logging helpers
    userInteraction(action: string, target?: string, context?: LogContext): void {
        this.info('User interaction', {
            ...context,
            action,
            target,
        });
    }

    // Error boundary logging
    errorBoundary(error: Error, errorInfo: any, context?: LogContext): void {
        this.error('Error boundary caught error', {
            ...context,
            error: error.message,
            stack: error.stack,
            errorInfo,
            action: 'error_boundary',
        });
    }
}

// Create and export logger instance
export const logger = new ClientLogger();

// Export individual methods for convenience
export const {
    debug,
    info,
    warn,
    error,
    authAttempt,
    authSuccess,
    authFailure,
    authLogout,
    apiRequest,
    apiResponse,
    apiError,
    navigation,
    componentMount,
    componentUnmount,
    componentError,
    performance,
    userInteraction,
    errorBoundary,
} = logger;
