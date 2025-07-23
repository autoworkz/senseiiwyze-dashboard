// Jest types declaration for TypeScript
declare global {
  const describe: (name: string, fn: () => void) => void
  const it: (name: string, fn: () => void | Promise<void>) => void
  const test: (name: string, fn: () => void | Promise<void>) => void
  const expect: any
  const jest: any
  const beforeEach: (fn: () => void | Promise<void>) => void
  const afterEach: (fn: () => void | Promise<void>) => void
  const beforeAll: (fn: () => void | Promise<void>) => void
  const afterAll: (fn: () => void | Promise<void>) => void
}

export {} 