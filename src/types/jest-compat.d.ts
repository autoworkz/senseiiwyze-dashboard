/**
 * Jest Compatibility Types for Vitest
 * 
 * This file provides Jest-compatible type definitions when using Vitest
 * with Jest syntax through the compatibility layer in vitest.setup.ts
 */

declare global {
  namespace jest {
    interface Mock<T = unknown> {
      mockReturnValue(value: unknown): this;
      mockResolvedValue(value: unknown): this;
      mockRejectedValue(value: unknown): this;
      mockImplementation(fn: (...args: unknown[]) => unknown): this;
      mockReturnValueOnce(value: unknown): this;
      mockResolvedValueOnce(value: unknown): this;
      mockRejectedValueOnce(value: unknown): this;
      mockImplementationOnce(fn: (...args: unknown[]) => unknown): this;
      mockClear(): void;
      mockReset(): void;
      mockRestore(): void;
    }
    
    interface MockedFunction<T = unknown> extends Mock<T> {
      (...args: T extends (...args: infer A) => unknown ? A : never): T extends (...args: unknown[]) => infer R ? R : never;
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
