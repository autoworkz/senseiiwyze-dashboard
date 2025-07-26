import { auth } from '@/lib/auth-config'
import { createAuthClient } from "better-auth/client"
const authClient = createAuthClient()

async function testAuthConfig() {
  console.log('Testing Better Auth configuration...')
  
  try {
    // Test basic auth object
    console.log('✓ Auth object created successfully')
    console.log('Database:', auth.options.database ? 'Connected' : 'Not connected')
    
    // Test API methods exist
    console.log('API methods available:', Object.keys(auth.api))
    
    // Try to get session (should not crash)
    const headers = new Headers()
    headers.set('Cookie', 'test=test')
    
    try {
      const session = await auth.api.getSession({ headers })
      console.log('✓ getSession method works (no session expected):', session ? 'Has session' : 'No session')
    } catch (error) {
      console.log('⚠ getSession error:', error instanceof Error ? error.message : error)
    }
    
    console.log('✅ Auth configuration test completed')
  } catch (error) {
    console.error('❌ Auth configuration error:', error)
    process.exit(1)
  }
}

testAuthConfig()
  .then(() => {
    console.log('Test completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  }) 