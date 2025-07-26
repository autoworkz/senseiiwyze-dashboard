import logger, {
    logError,
    logWarn,
    logInfo,
    logHttp,
    logDebug,
    createChildLogger
} from '../logger'

describe('Winston Logger', () => {
    // Mock console methods to avoid noise in tests
    const originalConsole = { ...console }

    beforeAll(() => {
        // Mock console methods
        console.log = jest.fn()
        console.warn = jest.fn()
        console.error = jest.fn()
        console.info = jest.fn()
        console.debug = jest.fn()
    })

    afterAll(() => {
        // Restore original console methods
        console.log = originalConsole.log
        console.warn = originalConsole.warn
        console.error = originalConsole.error
        console.info = originalConsole.info
        console.debug = originalConsole.debug
    })

    it('should create logger instance', () => {
        expect(logger).toBeDefined()
        expect(typeof logger.info).toBe('function')
        expect(typeof logger.error).toBe('function')
        expect(typeof logger.warn).toBe('function')
        expect(typeof logger.debug).toBe('function')
    })

    it('should have convenience methods', () => {
        expect(typeof logError).toBe('function')
        expect(typeof logWarn).toBe('function')
        expect(typeof logInfo).toBe('function')
        expect(typeof logHttp).toBe('function')
        expect(typeof logDebug).toBe('function')
    })

    it('should create child logger', () => {
        const childLogger = createChildLogger('Test')
        expect(childLogger).toBeDefined()
        expect(typeof childLogger.info).toBe('function')
        expect(typeof childLogger.error).toBe('function')
    })

    it('should log messages without throwing errors', () => {
        expect(() => {
            logger.info('Test info message')
            logger.warn('Test warning message')
            logger.error('Test error message')
            logger.debug('Test debug message')
        }).not.toThrow()
    })

    it('should use convenience methods without throwing errors', () => {
        expect(() => {
            logInfo('Test info message')
            logWarn('Test warning message')
            logError('Test error message')
            logHttp('Test HTTP message')
            logDebug('Test debug message')
        }).not.toThrow()
    })

    it('should handle child logger logging', () => {
        const childLogger = createChildLogger('TestComponent')

        expect(() => {
            childLogger.info('Child logger info message')
            childLogger.warn('Child logger warning message')
            childLogger.error('Child logger error message')
        }).not.toThrow()
    })

    it('should handle error objects', () => {
        const testError = new Error('Test error message')

        expect(() => {
            logError('Test error with Error object', testError)
        }).not.toThrow()
    })

    it('should handle metadata objects', () => {
        const metadata = {
            userId: '123',
            action: 'test',
            timestamp: new Date().toISOString()
        }

        expect(() => {
            logInfo('Test message with metadata', metadata)
        }).not.toThrow()
    })
}) 