import winston from 'winston'
import { format } from 'winston'

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

// Export convenience methods
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

// Export types for better TypeScript support
export type Logger = typeof logger
export type ChildLogger = ReturnType<typeof createChildLogger> 