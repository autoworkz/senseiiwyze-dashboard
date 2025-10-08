// Quick test to check if the database has the required columns
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSchema() {
  try {
    // Test if the is_onboarding column exists
    console.log('🔍 Testing profiles table schema...')
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, user_role, is_onboarding')
      .limit(1)
    
    if (error) {
      console.error('❌ Database error:', error.message)
      
      if (error.message.includes('column "is_onboarding" does not exist')) {
        console.log('💡 Solution: The is_onboarding column needs to be added to the database')
        console.log('📝 Run: npx drizzle-kit generate && npx drizzle-kit migrate')
      }
      
      if (error.message.includes('invalid input value for enum role_status')) {
        console.log('💡 Solution: The role_status enum needs to be updated with new values')
      }
    } else {
      console.log('✅ Database schema is correct!')
      console.log('📊 Sample data:', data)
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

testSchema()
