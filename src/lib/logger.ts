import winston from 'winston'
import { format } from 'winston'
import * as Sentry from '@sentry/nextjs'

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

// Tell winston that you want to link the colors
winston.addColors(colors)

// Define which level to log based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

// Define custom format for logs
const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

// Define format for production (without colors)
const productionFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.errors({ stack: true }),
    format.json(),
    format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`,
    ),
)

// Define transports based on environment
const transports = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    const isProduction = env === 'production'

    const transportArray: winston.transport[] = []

    // Console transport for all environments
    transportArray.push(
        new winston.transports.Console({
            format: isDevelopment ? customFormat : productionFormat,
        })
    )

    // File transports for production
    if (isProduction) {
        // Error log file
        transportArray.push(
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: productionFormat,
            })
        )

        // Combined log file
        transportArray.push(
            new winston.transports.File({
                filename: 'logs/combined.log',
                format: productionFormat,
            })
        )
    }

    return transportArray
}

// Create the logger instance
const logger = winston.createLogger({
    level: level(),
    levels,
    transports: transports(),
    // Handle uncaught exceptions and unhandled rejections
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' }),
    ],
})

// Create a stream object for Morgan (HTTP request logging)
export const stream = {
    write: (message: string) => {
        logger.http(message.trim())
    },
}

// Export the logger instance
export default logger

// Sentry integration helper
const sendToSentry = (level: string, message: string, meta?: any, error?: Error) => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!isDevelopment) {
        if (error) {
            Sentry.captureException(error, {
                extra: { message, ...meta }
            })
        } else {
            const sentryLevel = level === 'warn' ? 'warning' : level as 'info' | 'error' | 'debug'
            if (level === 'error' || level === 'warn') {
                Sentry.captureMessage(message, sentryLevel)
            }
            
            Sentry.addBreadcrumb({
                message,
                level: sentryLevel,
                data: meta
            })
        }
    }
}

// Export convenience methods with Sentry integration
export const logError = (message: string, error?: Error | unknown) => {
    if (error instanceof Error) {
        logger.error(`${message}: ${error.message}`, { stack: error.stack })
        sendToSentry('error', message, { stack: error.stack }, error)
    } else {
        logger.error(message, { error })
        sendToSentry('error', message, { error })
    }
}

export const logWarn = (message: string, meta?: any) => {
    logger.warn(message, meta)
    sendToSentry('warn', message, meta)
}

export const logInfo = (message: string, meta?: any) => {
    logger.info(message, meta)
    sendToSentry('info', message, meta)
}

export const logHttp = (message: string, meta?: any) => {
    logger.http(message, meta)
    sendToSentry('info', message, meta)
}

export const logDebug = (message: string, meta?: any) => {
    logger.debug(message, meta)
    sendToSentry('debug', message, meta)
}

// Export a function to create a child logger with context
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

// Specialized loggers for common contexts
export const middlewareLogger = createChildLogger('MIDDLEWARE')
export const authLogger = createChildLogger('AUTH')
export const emailLogger = createChildLogger('EMAIL')

// Sentry user context helpers
export const setUserContext = (user: { id: string; email?: string; role?: string }) => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
        Sentry.setUser({
            id: user.id,
            email: user.email,
            role: user.role,
        })
    }
}

export const clearUserContext = () => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
        Sentry.setUser(null)
    }
}

export const setTag = (key: string, value: string) => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
        Sentry.setTag(key, value)
    }
}

// Export types for better TypeScript support
export type Logger = typeof logger
export type ChildLogger = ReturnType<typeof createChildLogger> 