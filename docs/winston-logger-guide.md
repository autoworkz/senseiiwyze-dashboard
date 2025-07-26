# Winston Logger Implementation Guide

## Overview

The SenseiiWyze Dashboard uses Winston as its central logging solution. This implementation provides structured logging with environment-specific configurations, error handling, and performance monitoring capabilities.

## Features

- **Environment-specific logging**: Different log levels and formats for development vs production
- **Structured logging**: JSON format for production, colored console output for development
- **Error handling**: Automatic exception and rejection handling
- **Child loggers**: Context-specific logging for different parts of the application
- **Performance monitoring**: Built-in timing and duration tracking
- **File logging**: Automatic log file creation for production environments

## Installation

Winston is already installed in the project:

```bash
pnpm add winston
```

## Basic Usage

### Import the Logger

```typescript
import logger, { 
  logError, 
  logWarn, 
  logInfo, 
  logHttp, 
  logDebug, 
  createChildLogger 
} from '@/lib/logger'
```

### Basic Logging

```typescript
// Using the main logger
logger.info('Application started successfully')
logger.warn('Deprecated feature used')
logger.error('Database connection failed')
logger.debug('Processing user request')
logger.http('GET /api/users - 200 OK')

// Using convenience methods
logInfo('User logged in successfully', { userId: '123' })
logWarn('Rate limit approaching', { requests: 95, limit: 100 })
logError('API call failed', new Error('Network timeout'))
```

### Child Loggers

Create context-specific loggers for different parts of your application:

```typescript
const authLogger = createChildLogger('Auth')
const dbLogger = createChildLogger('Database')
const apiLogger = createChildLogger('API')

authLogger.info('User authentication successful', { userId: '123' })
dbLogger.warn('Slow query detected', { duration: '2.5s' })
apiLogger.error('External API call failed', new Error('Service unavailable'))
```

## Log Levels

The logger supports the following levels (in order of priority):

1. **error** (0) - Application errors and exceptions
2. **warn** (1) - Warning messages and potential issues
3. **info** (2) - General information and application events
4. **http** (3) - HTTP request/response logging
5. **debug** (4) - Detailed debugging information

### Environment-Specific Levels

- **Development**: `debug` level (shows all logs)
- **Production**: `warn` level (shows warnings and errors only)

## Configuration

### Development Environment

- **Console output**: Colored, formatted logs
- **Log level**: `debug`
- **Format**: `YYYY-MM-DD HH:mm:ss:ms level: message`

### Production Environment

- **Console output**: JSON formatted logs
- **File output**: Separate files for errors and combined logs
- **Log level**: `warn`
- **Files created**:
  - `logs/error.log` - Error-level logs only
  - `logs/combined.log` - All logs
  - `logs/exceptions.log` - Uncaught exceptions
  - `logs/rejections.log` - Unhandled promise rejections

## Usage Patterns

### 1. Error Handling

```typescript
try {
  // Some operation that might fail
  await databaseOperation()
} catch (error) {
  logError('Database operation failed', error)
  
  // Or with additional context
  logger.error('Database operation failed', {
    operation: 'user_creation',
    userId: '123',
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error)
  })
}
```

### 2. Performance Monitoring

```typescript
const startTime = Date.now()

// Perform operation
await someAsyncOperation()

const duration = Date.now() - startTime
logger.info('Operation completed', {
  operation: 'data_processing',
  duration: `${duration}ms`,
  success: true
})
```

### 3. HTTP Request Logging

```typescript
// In middleware or API routes
logHttp(`${method} ${url} - ${statusCode}`, {
  method,
  url,
  statusCode,
  duration: '150ms',
  userAgent,
  ip: forwardedFor
})
```

### 4. Security Event Logging

```typescript
logger.warn('Suspicious activity detected', {
  event: 'multiple_failed_logins',
  ip: '192.168.1.1',
  attempts: 5,
  timeWindow: '5 minutes',
  userId: '123',
  action: 'account_locked'
})
```

### 5. Business Logic Logging

```typescript
logger.info('User subscription upgraded', {
  userId: '123',
  oldPlan: 'basic',
  newPlan: 'premium',
  price: 29.99,
  currency: 'USD',
  timestamp: new Date().toISOString()
})
```

## Integration Examples

### React Components

```typescript
import { createChildLogger } from '@/lib/logger'

function UserProfile({ userId }: { userId: string }) {
  const logger = createChildLogger('UserProfile')
  
  useEffect(() => {
    logger.info('Component mounted', { userId })
  }, [userId])
  
  const handleEdit = () => {
    logger.debug('User clicked edit button', { userId, section: 'profile' })
    // Handle edit logic
  }
  
  return (
    // Component JSX
  )
}
```

### API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createChildLogger } from '@/lib/logger'

const apiLogger = createChildLogger('API')

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const data = await request.json()
    
    // Process request
    const result = await processData(data)
    
    const duration = Date.now() - startTime
    apiLogger.info('API request successful', {
      endpoint: '/api/users',
      method: 'POST',
      duration: `${duration}ms`,
      statusCode: 200
    })
    
    return NextResponse.json(result)
  } catch (error) {
    const duration = Date.now() - startTime
    apiLogger.error('API request failed', {
      endpoint: '/api/users',
      method: 'POST',
      duration: `${duration}ms`,
      error
    })
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Database Operations

```typescript
import { createChildLogger } from '@/lib/logger'

const dbLogger = createChildLogger('Database')

export async function getUserById(id: string) {
  const startTime = Date.now()
  
  try {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id])
    
    const duration = Date.now() - startTime
    dbLogger.info('Database query executed', {
      query: 'SELECT * FROM users WHERE id = ?',
      params: [id],
      duration: `${duration}ms`,
      rows: user ? 1 : 0
    })
    
    return user
  } catch (error) {
    const duration = Date.now() - startTime
    dbLogger.error('Database query failed', {
      query: 'SELECT * FROM users WHERE id = ?',
      params: [id],
      duration: `${duration}ms`,
      error
    })
    
    throw error
  }
}
```

## Best Practices

### 1. Use Appropriate Log Levels

- **error**: For actual errors that need immediate attention
- **warn**: For potential issues or deprecated features
- **info**: For general application events and user actions
- **http**: For HTTP request/response logging
- **debug**: For detailed debugging information

### 2. Include Relevant Context

Always include relevant metadata with your logs:

```typescript
logger.info('User action performed', {
  action: 'button_click',
  component: 'LoginForm',
  userId: '123',
  sessionId: 'abc-123-def',
  timestamp: new Date().toISOString()
})
```

### 3. Use Child Loggers for Context

Create child loggers for different parts of your application to make logs easier to filter and understand:

```typescript
const authLogger = createChildLogger('Auth')
const dbLogger = createChildLogger('Database')
const apiLogger = createChildLogger('API')
```

### 4. Handle Errors Properly

Always log errors with proper context and stack traces:

```typescript
try {
  // Operation
} catch (error) {
  logError('Operation failed', error)
}
```

### 5. Avoid Sensitive Information

Never log sensitive information like passwords, API keys, or personal data:

```typescript
// ❌ Don't do this
logger.info('User login attempt', { 
  email: 'user@example.com',
  password: 'secret123' // Never log passwords!
})

// ✅ Do this instead
logger.info('User login attempt', { 
  email: 'user@example.com',
  success: false
})
```

### 6. Use Structured Logging

Use objects for metadata instead of string concatenation:

```typescript
// ❌ Don't do this
logger.info(`User ${userId} clicked ${button} in ${component}`)

// ✅ Do this instead
logger.info('User interaction', {
  userId,
  action: 'button_click',
  button,
  component
})
```

## Environment Variables

The logger automatically detects the environment using `NODE_ENV`:

- `NODE_ENV=development`: Debug level, colored console output
- `NODE_ENV=production`: Warn level, JSON format, file logging

## File Structure

```
src/
├── lib/
│   ├── logger.ts              # Main logger implementation
│   └── logger-examples.ts     # Usage examples
├── logs/                      # Log files (created automatically)
│   ├── error.log             # Error-level logs
│   ├── combined.log          # All logs
│   ├── exceptions.log        # Uncaught exceptions
│   └── rejections.log        # Unhandled rejections
└── docs/
    └── winston-logger-guide.md # This documentation
```

## Monitoring and Maintenance

### Log Rotation

For production deployments, consider implementing log rotation to prevent log files from growing too large. You can use tools like `logrotate` or implement custom rotation logic.

### Log Analysis

Use log analysis tools to monitor application health:

- **Error rates**: Monitor error log frequency
- **Performance**: Track operation durations
- **Security**: Monitor suspicious activity patterns
- **User behavior**: Analyze user interaction patterns

### Cloudflare Workers Considerations

Since this application is deployed to Cloudflare Workers:

- File logging is not available in the Workers environment
- Console logs are automatically captured by Cloudflare's logging system
- Use structured logging for better integration with Cloudflare's monitoring tools
- Consider using Cloudflare's built-in analytics and monitoring features

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check the log level configuration
2. **File permissions**: Ensure the `logs/` directory is writable
3. **Performance impact**: Use appropriate log levels in production
4. **Memory usage**: Avoid logging large objects or circular references

### Debug Mode

To enable debug logging in production temporarily:

```typescript
// Override log level (use sparingly)
process.env.LOG_LEVEL = 'debug'
```

## Examples

See `src/lib/logger-examples.ts` for comprehensive usage examples covering:

- Basic logging patterns
- Error handling
- Performance monitoring
- Security logging
- React component integration
- API route logging
- Database operation logging
- And more...

## Contributing

When adding new logging to the application:

1. Use appropriate log levels
2. Include relevant context
3. Use child loggers for specific contexts
4. Follow the structured logging patterns
5. Test logging in both development and production environments 