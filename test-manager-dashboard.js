// Test script for Manager Dashboard functionality
// Run this after starting both backend and frontend servers

const testManagerDashboard = async () => {
  const baseUrl = 'http://localhost:3000';
  const frontendUrl = 'http://localhost:3001';
  let adminToken = '';
  let managerToken = '';
  let employeeToken = '';
  let managerId = '';
  let employeeId = '';
  let approvalFlowId = '';
  let expenseId = '';
  
  console.log('🧪 Testing Manager Dashboard Functionality\n');
  
  // Step 1: Create admin user and login
  console.log('1. Setting up admin authentication...');
  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin123456'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Admin Register Response:', registerData.success ? '✅ Success' : '❌ Failed');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123456'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      adminToken = loginData.data.token;
      console.log('Admin Login Response:', '✅ Success');
      console.log('⚠️  Note: You may need to update user role to Admin in database');
    }
  } catch (error) {
    console.error('Admin Authentication Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 2: Create manager and employee users
  console.log('2. Creating manager and employee users...');
  try {
    // Create manager
    const managerRegisterResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Manager User',
        email: 'manager@test.com',
        password: 'manager123'
      })
    });
    
    const managerRegisterData = await managerRegisterResponse.json();
    if (managerRegisterData.success) {
      managerId = managerRegisterData.data.id;
      console.log('Manager Created:', '✅ Success');
      console.log('Manager ID:', managerId);
    }
    
    // Create employee
    const employeeRegisterResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Employee User',
        email: 'employee@test.com',
        password: 'employee123'
      })
    });
    
    const employeeRegisterData = await employeeRegisterResponse.json();
    if (employeeRegisterData.success) {
      employeeId = employeeRegisterData.data.id;
      console.log('Employee Created:', '✅ Success');
      console.log('Employee ID:', employeeId);
    }
  } catch (error) {
    console.error('User Creation Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 3: Create approval flow (admin only)
  console.log('3. Creating approval flow...');
  if (adminToken && managerId && employeeId) {
    try {
      const createFlowResponse = await fetch(`${baseUrl}/api/admin/approval-flows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Standard Approval Flow',
          approvers: [managerId],
          type: 'Sequential'
        })
      });
      
      const createFlowData = await createFlowResponse.json();
      console.log('Create Approval Flow Response:', createFlowData.success ? '✅ Success' : '❌ Failed');
      if (createFlowData.success) {
        approvalFlowId = createFlowData.data._id;
        console.log('Approval Flow ID:', approvalFlowId);
      } else {
        console.log('Error:', createFlowData.message);
      }
    } catch (error) {
      console.error('Create Approval Flow Error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 4: Assign approval flow to employee (admin only)
  console.log('4. Assigning approval flow to employee...');
  if (adminToken && employeeId && approvalFlowId) {
    try {
      const updateUserResponse = await fetch(`${baseUrl}/api/admin/users/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalFlow: approvalFlowId
        })
      });
      
      const updateUserData = await updateUserResponse.json();
      console.log('Assign Approval Flow Response:', updateUserData.success ? '✅ Success' : '❌ Failed');
      if (!updateUserData.success) {
        console.log('Error:', updateUserData.message);
      }
    } catch (error) {
      console.error('Assign Approval Flow Error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 5: Login as employee and submit expense
  console.log('5. Employee submitting expense...');
  try {
    const employeeLoginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employee@test.com',
        password: 'employee123'
      })
    });
    
    const employeeLoginData = await employeeLoginResponse.json();
    if (employeeLoginData.success) {
      employeeToken = employeeLoginData.data.token;
      console.log('Employee Login Response:', '✅ Success');
      
      // Submit expense
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
        expenseId = submitExpenseData.data._id;
        console.log('Expense ID:', expenseId);
        console.log('Expense Status:', submitExpenseData.data.status);
      } else {
        console.log('Error:', submitExpenseData.message);
      }
    }
  } catch (error) {
    console.error('Employee Login/Submit Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 6: Login as manager and get pending approvals
  console.log('6. Manager getting pending approvals...');
  try {
    const managerLoginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'manager@test.com',
        password: 'manager123'
      })
    });
    
    const managerLoginData = await managerLoginResponse.json();
    if (managerLoginData.success) {
      managerToken = managerLoginData.data.token;
      console.log('Manager Login Response:', '✅ Success');
      
      // Get pending approvals
      const pendingApprovalsResponse = await fetch(`${baseUrl}/api/expenses/pending-approvals`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${managerToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      const pendingApprovalsData = await pendingApprovalsResponse.json();
      console.log('Get Pending Approvals Response:', pendingApprovalsData.success ? '✅ Success' : '❌ Failed');
      if (pendingApprovalsData.success) {
        console.log('Total Pending Approvals:', pendingApprovalsData.data.pagination.totalApprovals);
        console.log('Approvals:', pendingApprovalsData.data.approvals.map(approval => ({
          id: approval._id,
          employee: approval.employee.name,
          description: approval.description,
          amount: approval.amount,
          status: approval.status
        })));
      } else {
        console.log('Error:', pendingApprovalsData.message);
      }
    }
  } catch (error) {
    console.error('Manager Login/Get Approvals Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 7: Manager approves expense
  console.log('7. Manager approving expense...');
  if (managerToken && expenseId) {
    try {
      const approveExpenseResponse = await fetch(`${baseUrl}/api/expenses/${expenseId}/process`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${managerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve'
        })
      });
      
      const approveExpenseData = await approveExpenseResponse.json();
      console.log('Approve Expense Response:', approveExpenseData.success ? '✅ Success' : '❌ Failed');
      if (approveExpenseData.success) {
        console.log('Expense Status:', approveExpenseData.data.status);
        console.log('Current Approver Index:', approveExpenseData.data.currentApproverIndex);
      } else {
        console.log('Error:', approveExpenseData.message);
      }
    } catch (error) {
      console.error('Approve Expense Error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 8: Test rejection workflow
  console.log('8. Testing rejection workflow...');
  try {
    // Submit another expense
    const submitExpense2Response = await fetch(`${baseUrl}/api/expenses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${employeeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Taxi to airport',
        category: 'Transportation',
        amount: 25.00,
        currency: 'USD'
      })
    });
    
    const submitExpense2Data = await submitExpense2Response.json();
    if (submitExpense2Data.success) {
      const expense2Id = submitExpense2Data.data._id;
      console.log('Second Expense Submitted:', '✅ Success');
      
      // Manager rejects expense
      const rejectExpenseResponse = await fetch(`${baseUrl}/api/expenses/${expense2Id}/process`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${managerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject'
        })
      });
      
      const rejectExpenseData = await rejectExpenseResponse.json();
      console.log('Reject Expense Response:', rejectExpenseData.success ? '✅ Success' : '❌ Failed');
      if (rejectExpenseData.success) {
        console.log('Expense Status:', rejectExpenseData.data.status);
      } else {
        console.log('Error:', rejectExpenseData.message);
      }
    }
  } catch (error) {
    console.error('Rejection Workflow Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 9: Test unauthorized access
  console.log('9. Testing unauthorized access...');
  try {
    const unauthorizedResponse = await fetch(`${baseUrl}/api/expenses/pending-approvals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${employeeToken}`, // Employee trying to access manager endpoint
        'Content-Type': 'application/json',
      }
    });
    
    const unauthorizedData = await unauthorizedResponse.json();
    console.log('Unauthorized Access Response:', unauthorizedData.success ? '❌ Should have failed' : '✅ Correctly failed');
    console.log('Error Message:', unauthorizedData.message);
  } catch (error) {
    console.error('Unauthorized Access Test Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 10: Frontend testing instructions
  console.log('10. Frontend Testing Instructions:');
  console.log('🌐 Open your browser and navigate to:', frontendUrl);
  console.log('');
  console.log('📝 Test Manager Dashboard:');
  console.log('   Login with: manager@test.com / manager123');
  console.log('   Expected: Manager dashboard with pending approvals');
  console.log('   Features: Approve/Reject buttons, employee info, expense details');
  console.log('');
  console.log('📝 Test Employee Dashboard:');
  console.log('   Login with: employee@test.com / employee123');
  console.log('   Expected: Employee dashboard with expense submission');
  console.log('   Features: Submit expenses, view status, expense table');
  console.log('');
  console.log('✅ Expected Manager Features:');
  console.log('   - Pending approvals table with employee information');
  console.log('   - Approve/Reject buttons for each expense');
  console.log('   - Real-time updates after actions');
  console.log('   - Statistics showing pending count and total amount');
  console.log('   - Role-based access control');
  console.log('');
  console.log('🧪 Test the following manager actions:');
  console.log('   1. View pending approvals in the table');
  console.log('   2. Click "Approve" on an expense');
  console.log('   3. Verify success notification and table update');
  console.log('   4. Click "Reject" on another expense');
  console.log('   5. Verify rejection notification and table update');
  console.log('   6. Check that processed expenses are removed from pending list');
  
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🎉 Manager Dashboard testing completed!');
  console.log('\nNote: Make sure both backend (port 3000) and frontend (port 3001) servers are running.');
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testManagerDashboard().catch(console.error);
} else {
  // Browser environment
  testManagerDashboard().catch(console.error);
}
