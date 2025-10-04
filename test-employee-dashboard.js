// Test script for Employee Dashboard functionality
// Run this after starting both backend and frontend servers

const testEmployeeDashboard = async () => {
  const baseUrl = 'http://localhost:3000';
  const frontendUrl = 'http://localhost:3001';
  let employeeToken = '';
  let employeeId = '';
  
  console.log('🧪 Testing Employee Dashboard Functionality\n');
  
  // Step 1: Create and login as employee
  console.log('1. Setting up employee authentication...');
  try {
    // Register employee
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Employee',
        email: 'employee@test.com',
        password: 'employee123'
      })
    });
    
    const registerData = await registerResponse.json();
    if (registerData.success) {
      employeeId = registerData.data.id;
      console.log('Employee Created:', '✅ Success');
      console.log('Employee ID:', employeeId);
    }
    
    // Login employee
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employee@test.com',
        password: 'employee123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      employeeToken = loginData.data.token;
      console.log('Employee Login:', '✅ Success');
      console.log('Token:', employeeToken.substring(0, 20) + '...');
    }
  } catch (error) {
    console.error('Employee Setup Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 2: Test expense submission
  console.log('2. Testing expense submission...');
  try {
    const submitExpenseResponse = await fetch(`${baseUrl}/api/expenses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${employeeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Business lunch with client',
        category: 'Meals',
        amount: 45.50,
        currency: 'USD'
      })
    });
    
    const submitExpenseData = await submitExpenseResponse.json();
    console.log('Submit Expense Response:', submitExpenseData.success ? '✅ Success' : '❌ Failed');
    if (submitExpenseData.success) {
      console.log('Expense ID:', submitExpenseData.data._id);
      console.log('Expense Status:', submitExpenseData.data.status);
    } else {
      console.log('Error:', submitExpenseData.message);
    }
  } catch (error) {
    console.error('Expense Submission Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 3: Test getting employee expenses
  console.log('3. Testing expense retrieval...');
  try {
    const getExpensesResponse = await fetch(`${baseUrl}/api/expenses/my?page=1&limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${employeeToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const getExpensesData = await getExpensesResponse.json();
    console.log('Get Expenses Response:', getExpensesData.success ? '✅ Success' : '❌ Failed');
    if (getExpensesData.success) {
      console.log('Total Expenses:', getExpensesData.data.pagination.totalExpenses);
      console.log('Expenses:', getExpensesData.data.expenses.map(expense => ({
        id: expense._id,
        description: expense.description,
        amount: expense.amount,
        status: expense.status
      })));
    } else {
      console.log('Error:', getExpensesData.message);
    }
  } catch (error) {
    console.error('Get Expenses Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 4: Test multiple expense submissions
  console.log('4. Testing multiple expense submissions...');
  const testExpenses = [
    {
      description: 'Taxi to airport',
      category: 'Transportation',
      amount: 25.00,
      currency: 'USD'
    },
    {
      description: 'Hotel accommodation',
      category: 'Accommodation',
      amount: 120.00,
      currency: 'USD'
    },
    {
      description: 'Office supplies',
      category: 'Office Supplies',
      amount: 35.75,
      currency: 'USD'
    }
  ];
  
  for (let i = 0; i < testExpenses.length; i++) {
    try {
      const expense = testExpenses[i];
      const response = await fetch(`${baseUrl}/api/expenses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${employeeToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense)
      });
      
      const data = await response.json();
      console.log(`Expense ${i + 1} (${expense.description}):`, data.success ? '✅ Success' : '❌ Failed');
    } catch (error) {
      console.error(`Expense ${i + 1} Error:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 5: Test final expense list
  console.log('5. Testing final expense list...');
  try {
    const finalExpensesResponse = await fetch(`${baseUrl}/api/expenses/my?page=1&limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${employeeToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const finalExpensesData = await finalExpensesResponse.json();
    console.log('Final Expenses Response:', finalExpensesData.success ? '✅ Success' : '❌ Failed');
    if (finalExpensesData.success) {
      console.log('Total Expenses:', finalExpensesData.data.pagination.totalExpenses);
      console.log('Current Page:', finalExpensesData.data.pagination.currentPage);
      console.log('Total Pages:', finalExpensesData.data.pagination.totalPages);
      
      console.log('\nExpense Details:');
      finalExpensesData.data.expenses.forEach((expense, index) => {
        console.log(`${index + 1}. ${expense.description}`);
        console.log(`   Category: ${expense.category}`);
        console.log(`   Amount: $${expense.amount} ${expense.currency}`);
        console.log(`   Status: ${expense.status}`);
        console.log(`   Date: ${new Date(expense.submissionDate).toLocaleDateString()}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Final Expenses Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 6: Frontend testing instructions
  console.log('6. Frontend Testing Instructions:');
  console.log('🌐 Open your browser and navigate to:', frontendUrl);
  console.log('📝 Login with the following credentials:');
  console.log('   Email: employee@test.com');
  console.log('   Password: employee123');
  console.log('');
  console.log('✅ Expected Frontend Features:');
  console.log('   - Dashboard with expense statistics');
  console.log('   - Expense table with color-coded status badges');
  console.log('   - "Submit New Expense" button');
  console.log('   - Modal form for expense submission');
  console.log('   - Real-time data updates');
  console.log('   - Responsive design');
  console.log('');
  console.log('🧪 Test the following actions:');
  console.log('   1. View the expense list in the table');
  console.log('   2. Click "Submit New Expense" button');
  console.log('   3. Fill out the expense form');
  console.log('   4. Submit the form and verify success');
  console.log('   5. Check that the expense appears in the table');
  console.log('   6. Verify status badges are color-coded correctly');
  
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🎉 Employee Dashboard testing completed!');
  console.log('\nNote: Make sure both backend (port 3000) and frontend (port 3001) servers are running.');
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testEmployeeDashboard().catch(console.error);
} else {
  // Browser environment
  testEmployeeDashboard().catch(console.error);
}
