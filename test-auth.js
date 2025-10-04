// Simple test script to demonstrate authentication endpoints
// Run this after starting the server with: npm run dev

const testAuth = async () => {
  const baseUrl = 'http://localhost:3000/api/auth';
  
  console.log('🧪 Testing Authentication Endpoints\n');
  
  // Test 1: Register a new user
  console.log('1. Testing user registration...');
  try {
    const registerResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData);
    console.log('Status:', registerResponse.status);
  } catch (error) {
    console.error('Register Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Login with the registered user
  console.log('2. Testing user login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);
    console.log('Status:', loginResponse.status);
    
    if (loginData.success && loginData.data.token) {
      console.log('\n3. Testing protected route with token...');
      
      // Test 3: Access protected route
      const protectedResponse = await fetch('http://localhost:3000/api/protected/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const protectedData = await protectedResponse.json();
      console.log('Protected Route Response:', protectedData);
      console.log('Status:', protectedResponse.status);
    }
    
  } catch (error) {
    console.error('Login Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 4: Try to access protected route without token
  console.log('4. Testing protected route without token...');
  try {
    const noTokenResponse = await fetch('http://localhost:3000/api/protected/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const noTokenData = await noTokenResponse.json();
    console.log('No Token Response:', noTokenData);
    console.log('Status:', noTokenResponse.status);
  } catch (error) {
    console.error('No Token Error:', error.message);
  }
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testAuth().catch(console.error);
} else {
  // Browser environment
  testAuth().catch(console.error);
}
