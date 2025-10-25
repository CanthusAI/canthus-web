/**
 * Version utility for getting the application version
 * This reads the version from the workspace package.json
 */

// Import the version from the workspace package.json
// This will be resolved at build time by Vite
const VERSION = import.meta.env.VITE_APP_VERSION || '0.4.0';

/**
 * Get the current application version
 */
export function getVersion(): string {
    return VERSION;
}

/**
 * Get version info for tooltips and debugging
 */
export function getVersionInfo(): {
    version: string;
    buildTime?: string;
    environment: string;
} {
    return {
        version: VERSION,
        buildTime: import.meta.env.VITE_BUILD_TIME,
        environment: import.meta.env.NODE_ENV || 'development'
    };
}
