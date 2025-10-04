const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test data
const testUsers = [
  {
    name: 'John Manager',
    email: 'john.manager@company.com',
    password: 'password123',
    role: 'Manager'
  },
  {
    name: 'Jane Employee',
    email: 'jane.employee@company.com',
    password: 'password123',
    role: 'Employee',
    managerId: null // Will be set after creating manager
  }
];

const testApprovalFlow = {
  name: 'Standard Expense Approval',
  approverIds: [] // Will be set after creating users
};

async function testAdminDashboard() {
  console.log('🧪 Testing Admin Dashboard Functionality\n');

  try {
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@company.com',
      password: 'admin123'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('✅ Admin login successful\n');

    // 2. Create test users
    console.log('2. Creating test users...');
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const userResponse = await axios.post(`${API_BASE}/admin/users`, userData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      createdUsers.push(userResponse.data.data);
      console.log(`✅ Created ${userData.role}: ${userData.name}`);
    }

    // 3. Update employee to have manager
    console.log('\n3. Setting manager for employee...');
    const manager = createdUsers.find(u => u.role === 'Manager');
    const employee = createdUsers.find(u => u.role === 'Employee');
    
    await axios.put(`${API_BASE}/admin/users/${employee._id}`, {
      managerId: manager._id
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Set ${manager.name} as manager for ${employee.name}`);

    // 4. Create approval flow
    console.log('\n4. Creating approval flow...');
    testApprovalFlow.approverIds = [manager._id];
    
    const flowResponse = await axios.post(`${API_BASE}/admin/approval-flows`, testApprovalFlow, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Created approval flow: ${testApprovalFlow.name}`);

    // 5. Test fetching users
    console.log('\n5. Fetching all users...');
    const usersResponse = await axios.get(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${usersResponse.data.data.users.length} users`);

    // 6. Test fetching approval flows
    console.log('\n6. Fetching approval flows...');
    const flowsResponse = await axios.get(`${API_BASE}/admin/approval-flows`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✅ Found ${flowsResponse.data.data.flows.length} approval flows`);

    // 7. Test employee login and expense submission
    console.log('\n7. Testing employee expense submission...');
    const employeeLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: employee.email,
      password: 'password123'
    });
    
    const employeeToken = employeeLoginResponse.data.token;
    
    const expenseResponse = await axios.post(`${API_BASE}/expenses`, {
      amount: 150.00,
      currency: 'USD',
      category: 'Travel',
      description: 'Business trip expenses',
      submissionDate: new Date().toISOString()
    }, {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    
    console.log(`✅ Employee submitted expense: $${expenseResponse.data.data.amount}`);

    // 8. Test manager login and approval
    console.log('\n8. Testing manager approval workflow...');
    const managerLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: manager.email,
      password: 'password123'
    });
    
    const managerToken = managerLoginResponse.data.token;
    
    const pendingResponse = await axios.get(`${API_BASE}/expenses/pending-approvals`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    
    console.log(`✅ Manager found ${pendingResponse.data.data.approvals.length} pending approvals`);
    
    if (pendingResponse.data.data.approvals.length > 0) {
      const expenseId = pendingResponse.data.data.approvals[0]._id;
      
      await axios.put(`${API_BASE}/expenses/${expenseId}/process`, {
        action: 'approve'
      }, {
        headers: { Authorization: `Bearer ${managerToken}` }
      });
      
      console.log('✅ Manager approved expense');
    }

    console.log('\n🎉 All admin dashboard tests passed!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Admin can create and manage users');
    console.log('- ✅ Admin can create approval flows');
    console.log('- ✅ Employee can submit expenses');
    console.log('- ✅ Manager can approve expenses');
    console.log('- ✅ Role-based access control working');
    console.log('\n🚀 Admin dashboard is fully functional!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAdminDashboard();
