// Test script for expense endpoints
// Run this after starting the server with: npm run dev

const testExpenses = async () => {
  const baseUrl = 'http://localhost:3000';
  let authToken = '';
  let userId = '';
  
  console.log('🧪 Testing Expense Management Endpoints\n');
  
  // Step 1: Register and login a user
  console.log('1. Setting up authentication...');
  try {
    // Register a test user
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Employee',
        email: 'employee@example.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData.success ? '✅ Success' : '❌ Failed');
    
    // Login to get token
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employee@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      authToken = loginData.data.token;
      userId = loginData.data.user.id;
      console.log('Login Response:', '✅ Success');
      console.log('User ID:', userId);
    } else {
      console.log('Login Response:', '❌ Failed');
      return;
    }
  } catch (error) {
    console.error('Authentication Error:', error.message);
    return;
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 2: Submit a new expense
  console.log('2. Testing expense submission...');
  try {
    const submitResponse = await fetch(`${baseUrl}/api/expenses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Business lunch with client',
        category: 'Meals',
        amount: 45.50,
        currency: 'USD'
      })
    });
    
    const submitData = await submitResponse.json();
    console.log('Submit Expense Response:', submitData.success ? '✅ Success' : '❌ Failed');
    if (submitData.success) {
      console.log('Expense ID:', submitData.data._id);
      console.log('Status:', submitData.data.status);
    } else {
      console.log('Error:', submitData.message);
    }
  } catch (error) {
    console.error('Submit Expense Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 3: Submit another expense
  console.log('3. Testing another expense submission...');
  try {
    const submitResponse2 = await fetch(`${baseUrl}/api/expenses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Taxi to airport',
        category: 'Transportation',
        amount: 25.00,
        currency: 'USD'
      })
    });
    
    const submitData2 = await submitResponse2.json();
    console.log('Submit Expense 2 Response:', submitData2.success ? '✅ Success' : '❌ Failed');
    if (submitData2.success) {
      console.log('Expense ID:', submitData2.data._id);
    }
  } catch (error) {
    console.error('Submit Expense 2 Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 4: Get all user's expenses
  console.log('4. Testing get my expenses...');
  try {
    const getExpensesResponse = await fetch(`${baseUrl}/api/expenses/my`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const getExpensesData = await getExpensesResponse.json();
    console.log('Get My Expenses Response:', getExpensesData.success ? '✅ Success' : '❌ Failed');
    if (getExpensesData.success) {
      console.log('Total Expenses:', getExpensesData.data.pagination.totalExpenses);
      console.log('Expenses:', getExpensesData.data.expenses.map(exp => ({
        id: exp._id,
        description: exp.description,
        amount: exp.amount,
        status: exp.status
      })));
    } else {
      console.log('Error:', getExpensesData.message);
    }
  } catch (error) {
    console.error('Get Expenses Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 5: Test validation errors
  console.log('5. Testing validation errors...');
  try {
    const invalidResponse = await fetch(`${baseUrl}/api/expenses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: '', // Empty description
        category: 'Test',
        amount: -10 // Negative amount
      })
    });
    
    const invalidData = await invalidResponse.json();
    console.log('Invalid Expense Response:', invalidData.success ? '❌ Should have failed' : '✅ Correctly failed');
    console.log('Error Message:', invalidData.message);
  } catch (error) {
    console.error('Validation Test Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 6: Test without authentication
  console.log('6. Testing without authentication...');
  try {
    const noAuthResponse = await fetch(`${baseUrl}/api/expenses/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const noAuthData = await noAuthResponse.json();
    console.log('No Auth Response:', noAuthData.success ? '❌ Should have failed' : '✅ Correctly failed');
    console.log('Error Message:', noAuthData.message);
  } catch (error) {
    console.error('No Auth Test Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🎉 Expense endpoint testing completed!');
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testExpenses().catch(console.error);
} else {
  // Browser environment
  testExpenses().catch(console.error);
}
