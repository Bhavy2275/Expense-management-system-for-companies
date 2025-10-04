// Test script for approval flow endpoints
// Run this after starting the server with: npm run dev

const testApprovalFlows = async () => {
  const baseUrl = 'http://localhost:3000';
  let adminToken = '';
  let userId1 = '';
  let userId2 = '';
  let createdFlowId = '';
  
  console.log('🧪 Testing Admin Approval Flow Endpoints\n');
  
  // Step 1: Create admin user and login
  console.log('1. Setting up admin authentication...');
  try {
    // Register an admin user
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'admin123456'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Admin Register Response:', registerData.success ? '✅ Success' : '❌ Failed');
    
    // Login as admin
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@company.com',
        password: 'admin123456'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      adminToken = loginData.data.token;
      console.log('Admin Login Response:', '✅ Success');
      console.log('Admin Role:', loginData.data.user.role);
      
      if (loginData.data.user.role !== 'Admin') {
        console.log('⚠️  Note: User is not an admin yet. Please update the role in the database.');
        console.log('MongoDB command: db.users.updateOne({email: "admin@company.com"}, {$set: {role: "Admin"}})');
      }
    } else {
      console.log('Admin Login Response:', '❌ Failed');
    }
  } catch (error) {
    console.error('Admin Authentication Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 2: Create some users to use as approvers
  console.log('2. Creating users for approval flow...');
  try {
    // Create first user
    const user1Response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Manager One',
        email: 'manager1@company.com',
        password: 'manager123'
      })
    });
    
    const user1Data = await user1Response.json();
    if (user1Data.success) {
      userId1 = user1Data.data.id;
      console.log('User 1 Created:', '✅ Success');
      console.log('User 1 ID:', userId1);
    }
    
    // Create second user
    const user2Response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Manager Two',
        email: 'manager2@company.com',
        password: 'manager123'
      })
    });
    
    const user2Data = await user2Response.json();
    if (user2Data.success) {
      userId2 = user2Data.data.id;
      console.log('User 2 Created:', '✅ Success');
      console.log('User 2 ID:', userId2);
    }
  } catch (error) {
    console.error('User Creation Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 3: Create an approval flow
  console.log('3. Testing create approval flow...');
  if (userId1 && userId2) {
    try {
      const createFlowResponse = await fetch(`${baseUrl}/api/admin/approval-flows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Standard Expense Approval',
          approvers: [userId1, userId2],
          type: 'Sequential',
          splitVotePercentage: 50
        })
      });
      
      const createFlowData = await createFlowResponse.json();
      console.log('Create Approval Flow Response:', createFlowData.success ? '✅ Success' : '❌ Failed');
      if (createFlowData.success) {
        createdFlowId = createFlowData.data._id;
        console.log('Approval Flow ID:', createdFlowId);
        console.log('Flow Name:', createFlowData.data.name);
        console.log('Flow Type:', createFlowData.data.type);
        console.log('Approvers Count:', createFlowData.data.approvers.length);
      } else {
        console.log('Error:', createFlowData.message);
      }
    } catch (error) {
      console.error('Create Approval Flow Error:', error.message);
    }
  } else {
    console.log('Skipping approval flow creation - missing user IDs');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 4: Create another approval flow
  console.log('4. Testing create another approval flow...');
  if (userId1) {
    try {
      const createFlow2Response = await fetch(`${baseUrl}/api/admin/approval-flows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Quick Approval',
          approvers: [userId1],
          type: 'Simultaneous'
        })
      });
      
      const createFlow2Data = await createFlow2Response.json();
      console.log('Create Approval Flow 2 Response:', createFlow2Data.success ? '✅ Success' : '❌ Failed');
      if (createFlow2Data.success) {
        console.log('Approval Flow 2 ID:', createFlow2Data.data._id);
        console.log('Flow 2 Name:', createFlow2Data.data.name);
        console.log('Flow 2 Type:', createFlow2Data.data.type);
      } else {
        console.log('Error:', createFlow2Data.message);
      }
    } catch (error) {
      console.error('Create Approval Flow 2 Error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 5: Get all approval flows
  console.log('5. Testing get all approval flows...');
  try {
    const getFlowsResponse = await fetch(`${baseUrl}/api/admin/approval-flows`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const getFlowsData = await getFlowsResponse.json();
    console.log('Get All Approval Flows Response:', getFlowsData.success ? '✅ Success' : '❌ Failed');
    if (getFlowsData.success) {
      console.log('Total Flows:', getFlowsData.data.pagination.totalFlows);
      console.log('Flows:', getFlowsData.data.approvalFlows.map(flow => ({
        id: flow._id,
        name: flow.name,
        type: flow.type,
        approversCount: flow.approvers.length
      })));
    } else {
      console.log('Error:', getFlowsData.message);
    }
  } catch (error) {
    console.error('Get Approval Flows Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 6: Get specific approval flow
  if (createdFlowId) {
    console.log('6. Testing get specific approval flow...');
    try {
      const getFlowResponse = await fetch(`${baseUrl}/api/admin/approval-flows/${createdFlowId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      const getFlowData = await getFlowResponse.json();
      console.log('Get Specific Approval Flow Response:', getFlowData.success ? '✅ Success' : '❌ Failed');
      if (getFlowData.success) {
        console.log('Flow Name:', getFlowData.data.name);
        console.log('Flow Type:', getFlowData.data.type);
        console.log('Approvers:', getFlowData.data.data.approvers.map(approver => approver.name));
      } else {
        console.log('Error:', getFlowData.message);
      }
    } catch (error) {
      console.error('Get Specific Approval Flow Error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 7: Test validation errors
  console.log('7. Testing validation errors...');
  try {
    const invalidResponse = await fetch(`${baseUrl}/api/admin/approval-flows`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '', // Empty name
        approvers: [], // Empty approvers
        type: 'InvalidType' // Invalid type
      })
    });
    
    const invalidData = await invalidResponse.json();
    console.log('Invalid Approval Flow Response:', invalidData.success ? '❌ Should have failed' : '✅ Correctly failed');
    console.log('Error Message:', invalidData.message);
  } catch (error) {
    console.error('Validation Test Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 8: Test without authentication
  console.log('8. Testing without authentication (should fail)...');
  try {
    const noAuthResponse = await fetch(`${baseUrl}/api/admin/approval-flows`, {
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
  console.log('🎉 Approval flow endpoint testing completed!');
  console.log('\nNote: To test admin functionality, you may need to manually update a user\'s role to "Admin" in the database.');
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testApprovalFlows().catch(console.error);
} else {
  // Browser environment
  testApprovalFlows().catch(console.error);
}
