// Simple fetch test
async function testRoute() {
  try {
    console.log('Testing /en/auth/login...');
    const response = await fetch('http://localhost:3000/en/auth/login');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));
    
    if (text.includes('404') || text.includes('not-found')) {
      console.log('❌ Page still returns 404');
    } else if (text.includes('login') || text.includes('email')) {
      console.log('✅ Login page found!');
    } else {
      console.log('⚠️ Unexpected response');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testRoute();