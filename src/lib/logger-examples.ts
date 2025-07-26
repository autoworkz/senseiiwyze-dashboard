/**
 * Winston Logger Usage Examples
 * 
 * This file demonstrates how to use the central Winston logger
 * throughout the SenseiiWyze Dashboard application.
 */

import logger, {
    logError,
    logWarn,
    logInfo,
    logHttp,
    logDebug,
    createChildLogger
} from './logger'

// Example 1: Basic logging with the main logger
export function basicLoggingExample() {
    logger.info('Application started successfully')
    logger.warn('Deprecated feature used')
    logger.error('Database connection failed')
    logger.debug('Processing user request')
    logger.http('GET /api/users - 200 OK')
}

// Example 2: Using convenience methods
export function convenienceMethodsExample() {
    logInfo('User logged in successfully', { userId: '123', email: 'user@example.com' })
    logWarn('Rate limit approaching', { requests: 95, limit: 100 })
    logError('API call failed', new Error('Network timeout'))
    logHttp('POST /api/auth/login - 401 Unauthorized')
    logDebug('Processing form data', { fields: ['email', 'password'] })
}

// Example 3: Using child loggers for specific contexts
export function childLoggerExample() {
    // Create child loggers for different parts of the application
    const authLogger = createChildLogger('Auth')
    const dbLogger = createChildLogger('Database')
    const apiLogger = createChildLogger('API')

    // Use them in their respective contexts
    authLogger.info('User authentication successful', { userId: '123' })
    dbLogger.warn('Slow query detected', { query: 'SELECT * FROM users', duration: '2.5s' })
    apiLogger.error('External API call failed', new Error('Service unavailable'))
}

// Example 4: Error handling with detailed logging
export function errorHandlingExample() {
    try {
        // Simulate some operation that might fail
        throw new Error('Database connection timeout')
    } catch (error) {
        logError('Failed to connect to database', error)

        // You can also add additional context
        logger.error('Database operation failed', {
            operation: 'user_creation',
            userId: '123',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : String(error)
        })
    }
}

// Example 5: Performance monitoring
export function performanceLoggingExample() {
    const startTime = Date.now()

    // Simulate some operation
    setTimeout(() => {
        const duration = Date.now() - startTime
        logger.info('Operation completed', {
            operation: 'data_processing',
            duration: `${duration}ms`,
            success: true
        })
    }, 100)
}

// Example 6: Structured logging for analytics
export function structuredLoggingExample() {
    logger.info('User action performed', {
        action: 'button_click',
        component: 'LoginForm',
        userId: '123',
        sessionId: 'abc-123-def',
        timestamp: new Date().toISOString(),
        metadata: {
            browser: 'Chrome',
            version: '120.0.0.0',
            platform: 'macOS'
        }
    })
}

// Example 7: HTTP request logging
export function httpLoggingExample() {
    // In your API routes or middleware
    const requestInfo = {
        method: 'POST',
        url: '/api/auth/login',
        statusCode: 200,
        duration: '150ms',
        userAgent: 'Mozilla/5.0...',
        ip: '192.168.1.1'
    }

    logHttp(`${requestInfo.method} ${requestInfo.url} - ${requestInfo.statusCode}`, requestInfo)
}

// Example 8: Environment-specific logging
export function environmentSpecificExample() {
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
        // Detailed logging for development
        logDebug('Component re-rendered', {
            component: 'UserProfile',
            props: { userId: '123' },
            renderCount: 5
        })
    } else {
        // Minimal logging for production
        logInfo('Component rendered', { component: 'UserProfile' })
    }
}

// Example 9: Logging with metadata for debugging
export function debuggingExample() {
    const debugInfo = {
        component: 'DataTable',
        action: 'sort',
        column: 'name',
        direction: 'asc',
        rowCount: 100,
        timestamp: new Date().toISOString()
    }

    logDebug('Table sorting applied', debugInfo)
}

// Example 10: Security event logging
export function securityLoggingExample() {
    logger.warn('Suspicious activity detected', {
        event: 'multiple_failed_logins',
        ip: '192.168.1.1',
        attempts: 5,
        timeWindow: '5 minutes',
        userId: '123',
        action: 'account_locked'
    })
}

// Example 11: Business logic logging
export function businessLogicExample() {
    logger.info('User subscription upgraded', {
        userId: '123',
        oldPlan: 'basic',
        newPlan: 'premium',
        price: 29.99,
        currency: 'USD',
        timestamp: new Date().toISOString()
    })
}

// Example 12: Integration with React components
export function reactComponentExample() {
    // In a React component or hook
    const componentLogger = createChildLogger('UserProfile')

    // Log component lifecycle events
    componentLogger.info('Component mounted', { userId: '123' })

    // Log user interactions
    componentLogger.debug('User clicked edit button', {
        userId: '123',
        section: 'profile'
    })

    // Log errors
    try {
        // Some operation
    } catch (error) {
        componentLogger.error('Failed to update profile', error)
    }
}

// Example 13: Database operation logging
export function databaseLoggingExample() {
    const dbLogger = createChildLogger('Database')

    dbLogger.info('Database query executed', {
        query: 'SELECT * FROM users WHERE id = ?',
        params: ['123'],
        duration: '45ms',
        rows: 1
    })

    dbLogger.warn('Slow query detected', {
        query: 'SELECT * FROM orders JOIN users ON orders.user_id = users.id',
        duration: '2.3s',
        rows: 1000
    })
}

// Example 14: API integration logging
export function apiIntegrationExample() {
    const apiLogger = createChildLogger('ExternalAPI')

    apiLogger.info('External API call successful', {
        service: 'payment_processor',
        endpoint: '/v1/charges',
        duration: '500ms',
        statusCode: 200
    })

    apiLogger.error('External API call failed', {
        service: 'email_service',
        endpoint: '/v1/send',
        statusCode: 500,
        error: 'Service unavailable'
    })
}

// Example 15: Batch operation logging
export function batchOperationExample() {
    const batchLogger = createChildLogger('BatchProcessor')

    batchLogger.info('Batch operation started', {
        operation: 'user_import',
        totalRecords: 1000,
        batchSize: 100
    })

    // Log progress
    batchLogger.info('Batch operation progress', {
        operation: 'user_import',
        processed: 500,
        total: 1000,
        percentage: 50
    })

    batchLogger.info('Batch operation completed', {
        operation: 'user_import',
        totalProcessed: 1000,
        successful: 995,
        failed: 5,
        duration: '2m 30s'
    })
} 