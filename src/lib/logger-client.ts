/**
 * Client-Safe Logger
 * 
 * Provides the same interface as the server-side Winston logger
 * but uses browser-safe console methods instead of Winston.
 * 
 * This prevents Winston from being bundled in client-side code
 * while maintaining logging functionality.
 */

// Define log levels matching Winston
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// Define which level to log based on environment
const getLogLevel = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

// Check if a log level should be output
const shouldLog = (level: keyof typeof levels): boolean => {
    const currentLevel = getLogLevel()
    const currentLevelValue = levels[currentLevel as keyof typeof levels]
    const messageLevelValue = levels[level]
    return messageLevelValue <= currentLevelValue
}

// Format timestamp for consistency with server logger
const getTimestamp = (): string => {
    return new Date().toISOString().replace('T', ' ').replace('Z', '')
}

// Format log message consistently
const formatMessage = (level: string, message: string): string => {
    return `${getTimestamp()} ${level.toUpperCase()}: ${message}`
}

// Client-safe logger implementation
const logger = {
    error: (message: string, meta?: any) => {
        if (shouldLog('error')) {
            console.error(formatMessage('error', message), meta || '')
        }
    },
    
    warn: (message: string, meta?: any) => {
        if (shouldLog('warn')) {
            console.warn(formatMessage('warn', message), meta || '')
        }
    },
    
    info: (message: string, meta?: any) => {
        if (shouldLog('info')) {
            console.info(formatMessage('info', message), meta || '')
        }
    },
    
    http: (message: string, meta?: any) => {
        if (shouldLog('http')) {
            console.log(formatMessage('http', message), meta || '')
        }
    },
    
    debug: (message: string, meta?: any) => {
        if (shouldLog('debug')) {
            console.debug(formatMessage('debug', message), meta || '')
        }
    }
}

// Export convenience methods (matching server logger API)
export const logError = (message: string, error?: Error | unknown) => {
    if (error instanceof Error) {
        logger.error(`${message}: ${error.message}`, { stack: error.stack })
    } else {
        logger.error(message, { error })
    }
}

export const logWarn = (message: string, meta?: any) => {
    logger.warn(message, meta)
}

export const logInfo = (message: string, meta?: any) => {
    logger.info(message, meta)
}

export const logHttp = (message: string, meta?: any) => {
    logger.http(message, meta)
}

export const logDebug = (message: string, meta?: any) => {
    logger.debug(message, meta)
}

// Export a function to create a child logger with context (matching server logger API)
export const createChildLogger = (context: string) => {
    return {
        error: (message: string, error?: Error | unknown) => {
            logError(`[${context}] ${message}`, error)
        },
        warn: (message: string, meta?: any) => {
            logWarn(`[${context}] ${message}`, meta)
        },
        info: (message: string, meta?: any) => {
            logInfo(`[${context}] ${message}`, meta)
        },
        http: (message: string, meta?: any) => {
            logHttp(`[${context}] ${message}`, meta)
        },
        debug: (message: string, meta?: any) => {
            logDebug(`[${context}] ${message}`, meta)
        },
    }
}

// Specialized loggers for common contexts (matching server logger API)
export const middlewareLogger = createChildLogger('MIDDLEWARE')
export const authLogger = createChildLogger('AUTH')
export const emailLogger = createChildLogger('EMAIL')

// Export the main logger
export default logger

// Export types for better TypeScript support
export type Logger = typeof logger
export type ChildLogger = ReturnType<typeof createChildLogger>