// Debug the exact flow
async function testFlow() {
  try {
    console.log('=== Testing Root URL ===');
    const rootResponse = await fetch('http://localhost:3000/', { redirect: 'manual' });
    console.log('Root status:', rootResponse.status);
    console.log('Root location:', rootResponse.headers.get('location'));
    
    console.log('\n=== Testing Localized Landing Page ===');
    const enResponse = await fetch('http://localhost:3000/en');
    console.log('EN status:', enResponse.status);
    console.log('EN headers:', Object.fromEntries(enResponse.headers.entries()));
    
    if (enResponse.status === 404) {
      const text = await enResponse.text();
      console.log('404 response preview:', text.substring(0, 200));
      
      if (text.includes('i18n.ts:20:104')) {
        console.log('❌ Still has i18n compilation error');
      }
    }

    console.log('\n=== Testing Auth Route ===');
    const loginResponse = await fetch('http://localhost:3000/en/auth/login');
    console.log('Login status:', loginResponse.status);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFlow();