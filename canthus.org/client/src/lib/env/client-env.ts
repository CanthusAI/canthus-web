// Client-side environment variable validation and management
import { logger } from '@/lib/logger';

// Re-export logger for convenience
export { logger };

export interface ClientEnv {
    VITE_SERVER_URL: string;
    NODE_ENV?: string;
    VITE_ENV_NAME?: string;
}

export function getClientEnv(): ClientEnv {
    const env = import.meta.env;

    // Log available environment variables for debugging
    const availableVars = Object.keys(env).filter(key => key.startsWith('VITE_') || key === 'NODE_ENV');
    logger.debug('Available client environment variables:', {
        component: 'ClientEnv',
        variables: availableVars,
        totalCount: availableVars.length
    });

    const clientEnv: ClientEnv = {
        VITE_SERVER_URL: env.VITE_SERVER_URL as string || '',
        NODE_ENV: env.NODE_ENV as string,
        VITE_ENV_NAME: env.VITE_ENV_NAME as string,
    };

    return clientEnv;
}

export function validateClientEnv(env?: ClientEnv): ClientEnv {
    const envVars = env || getClientEnv();

    // Log environment variables for debugging
    logger.debug('Client environment variables:', {
        component: 'ClientEnv',
        hasServerUrl: !!envVars.VITE_SERVER_URL,
        nodeEnv: envVars.NODE_ENV,
        envName: envVars.VITE_ENV_NAME,
        totalKeys: Object.keys(envVars).length
    });

    // Only validate if we have environment variables to validate
    if (envVars && Object.keys(envVars).length > 0) {
        const missingVars: string[] = [];

        if (!envVars.VITE_SERVER_URL) {
            missingVars.push("VITE_SERVER_URL");
        } else {
            // Validate URL format
            try {
                new URL(envVars.VITE_SERVER_URL);
            } catch (e) {
                const errorMessage = `VITE_SERVER_URL is not a valid URL: ${envVars.VITE_SERVER_URL}`;
                logger.error(errorMessage, { component: 'ClientEnv' });
                throw new Error(errorMessage);
            }
        }

        if (missingVars.length > 0) {
            const errorMessage = `Missing required client environment variables: ${missingVars.join(', ')}. ` +
                `For Cloudflare Pages, set these in wrangler.toml or the Pages dashboard. ` +
                `For local development, create a .env file with VITE_ prefixed variables.`;
            logger.error(errorMessage, { component: 'ClientEnv' });
            throw new Error(errorMessage);
        }
    } else {
        logger.warn('No client environment variables provided. Make sure to:');
        logger.warn('1. Set VITE_SERVER_URL in your environment');
        logger.warn('2. For Cloudflare Pages, configure in wrangler.toml or dashboard');
        logger.warn('3. For local development, create .env files with VITE_ prefixes');
    }

    return envVars;
}

export function getServerUrl(): string {
    try {
        const env = validateClientEnv();
        return env.VITE_SERVER_URL;
    } catch (error) {
        logger.error('Failed to get server URL', {
            component: 'ClientEnv',
            error: (error as Error).message
        });

        // Fallback URLs based on environment
        const isDevelopment = import.meta.env.DEV;
        const fallbackUrl = isDevelopment
            ? 'http://localhost:3000'
            : 'https://api.canthus.org';

        logger.warn('Using fallback server URL', {
            component: 'ClientEnv',
            fallbackUrl,
            isDevelopment
        });

        return fallbackUrl;
    }
}


export function isProduction(): boolean {
    const env = getClientEnv();
    return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
    const env = getClientEnv();
    return env.NODE_ENV === 'development' || import.meta.env.DEV;
}

// Environment-specific configuration
export function getEnvironmentConfig() {
    const env = getClientEnv();
    const isProd = isProduction();
    const isDev = isDevelopment();

    return {
        isProduction: isProd,
        isDevelopment: isDev,
        environment: env.NODE_ENV || 'development',
        envName: env.VITE_ENV_NAME || 'local',
        serverUrl: env.VITE_SERVER_URL,
        logLevel: isProd ? 'info' : 'debug',
    };
}

// Initialize and validate environment on module load
let validatedEnv: ClientEnv | null = null;

export function initializeClientEnv(): ClientEnv {
    if (!validatedEnv) {
        try {
            validatedEnv = validateClientEnv();
            logger.info('Client environment initialized successfully', {
                component: 'ClientEnv',
                environment: validatedEnv.NODE_ENV,
                serverUrl: validatedEnv.VITE_SERVER_URL
            });
        } catch (error) {
            logger.error('Client environment validation failed', {
                component: 'ClientEnv',
                error: (error as Error).message
            });

            // Use fallback configuration
            validatedEnv = {
                VITE_SERVER_URL: getServerUrl(),
                NODE_ENV: isDevelopment() ? 'development' : 'production'
            };
        }
    }

    return validatedEnv;
}

// Auto-initialize on import
initializeClientEnv();
