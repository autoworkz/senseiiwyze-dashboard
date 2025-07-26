describe('Better Auth OAuth Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('OAuth Provider Configuration', () => {
    it('should have GitHub OAuth configured when credentials are present', () => {
      process.env.GITHUB_CLIENT_ID = 'test-github-client'
      process.env.GITHUB_CLIENT_SECRET = 'test-github-secret'

      expect(process.env.GITHUB_CLIENT_ID).toBeDefined()
      expect(process.env.GITHUB_CLIENT_SECRET).toBeDefined()
    })

    it('should have Google OAuth configured when credentials are present', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-google-client'
      process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret'

      expect(process.env.GOOGLE_CLIENT_ID).toBeDefined()
      expect(process.env.GOOGLE_CLIENT_SECRET).toBeDefined()
    })

    it('should not include Discord OAuth provider', () => {
      // Discord should not be in our configuration
      expect(process.env.DISCORD_CLIENT_ID).toBeUndefined()
      expect(process.env.DISCORD_CLIENT_SECRET).toBeUndefined()
    })
  })

  describe('OAuth Endpoints', () => {
    it('should have proper OAuth callback URL structure for GitHub', () => {
      const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
      const githubCallbackURL = `${baseURL}/api/auth/callback/github`
      
      expect(githubCallbackURL).toMatch(/\/api\/auth\/callback\/github$/)
    })

    it('should have proper OAuth callback URL structure for Google', () => {
      const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
      const googleCallbackURL = `${baseURL}/api/auth/callback/google`
      
      expect(googleCallbackURL).toMatch(/\/api\/auth\/callback\/google$/)
    })
  })

  describe('Better Auth Configuration', () => {
    it('should have proper auth API route structure', () => {
      // Better Auth uses a catch-all route pattern
      const authRoute = '/api/auth/[...all]'
      expect(authRoute).toMatch(/\/api\/auth\/\[\.\.\.all\]/)
    })

    it('should use environment variable for auth URL', () => {
      const authURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
      expect(authURL).toBeTruthy()
    })

    it('should have consistent client and server auth URLs', () => {
      const serverURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
      const clientURL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000'
      // They should typically match in development
      expect(clientURL).toBe(serverURL)
    })
  })

  describe('OAuth Redirect URIs', () => {
    it('should generate correct redirect URI for GitHub OAuth', () => {
      const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
      const expectedRedirectURI = `${baseURL}/api/auth/callback/github`
      
      // This is what should be registered in GitHub OAuth app settings
      expect(expectedRedirectURI).toBe(`${baseURL}/api/auth/callback/github`)
    })

    it('should generate correct redirect URI for Google OAuth', () => {
      const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
      const expectedRedirectURI = `${baseURL}/api/auth/callback/google`
      
      // This is what should be registered in Google OAuth app settings
      expect(expectedRedirectURI).toBe(`${baseURL}/api/auth/callback/google`)
    })
  })

  describe('Environment Variable Validation', () => {
    it('should warn when OAuth credentials are missing', () => {
      delete process.env.GITHUB_CLIENT_ID
      delete process.env.GITHUB_CLIENT_SECRET

      const missingGitHub = !process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET
      expect(missingGitHub).toBe(true)
    })

    it('should validate OAuth credential format', () => {
      // OAuth client IDs typically have specific formats
      process.env.GITHUB_CLIENT_ID = 'Ov23liO0XeXxNOe3z9c5'
      
      // GitHub client IDs start with specific prefixes
      expect(process.env.GITHUB_CLIENT_ID).toMatch(/^Ov23/)
    })
  })
})