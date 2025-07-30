/**
 * Jest Compatibility Types for Vitest
 * 
 * This file provides Jest-compatible type definitions when using Vitest
 * with Jest syntax through the compatibility layer in vitest.setup.ts
 */

declare global {
  namespace jest {
    interface Mock<T = any> {
      (...args: any[]): T;
      mockReturnValue(value: T): this;
      mockResolvedValue(value: T): this;
      mockRejectedValue(value: any): this;
      mockImplementation(fn?: (...args: any[]) => T): this;
      mockReturnValueOnce(value: T): this;
      mockResolvedValueOnce(value: T): this;
      mockRejectedValueOnce(value: any): this;
      mockImplementationOnce(fn: (...args: any[]) => T): this;
      mockClear(): void;
      mockReset(): void;
      mockRestore(): void;
      mock: {
        calls: any[][];
        results: Array<{ type: 'return' | 'throw'; value: any }>;
      };
    }
    
    interface MockedFunction<T extends (...args: any[]) => any> extends Mock<ReturnType<T>> {
      (...args: Parameters<T>): ReturnType<T>;
    }
    
    const fn: typeof vi.fn;
    const mock: typeof vi.mock;
    const unmock: typeof vi.unmock;
    const clearAllMocks: typeof vi.clearAllMocks;
    const resetAllMocks: typeof vi.resetAllMocks;
    const restoreAllMocks: typeof vi.restoreAllMocks;
    const clearAllTimers: typeof vi.clearAllTimers;
    const useFakeTimers: typeof vi.useFakeTimers;
    const useRealTimers: typeof vi.useRealTimers;
    const advanceTimersByTime: typeof vi.advanceTimersByTime;
    const spyOn: typeof vi.spyOn;
  }

  const jest: typeof globalThis.jest;
  const fail: (message?: string) => never;
}

export {};
