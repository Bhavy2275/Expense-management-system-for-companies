// Test script for admin endpoints
// Run this after starting the server with: npm run dev

const testAdmin = async () => {
  const baseUrl = 'http://localhost:3000';
  let adminToken = '';
  let employeeToken = '';
  let createdUserId = '';
  
  console.log('🧪 Testing Admin User Management Endpoints\n');
  
  // Step 1: Create an admin user and login
  console.log('1. Setting up admin authentication...');
  try {
    // Register an admin user (we'll need to manually set role in database or create via API)
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123'
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
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      adminToken = loginData.data.token;
      console.log('Admin Login Response:', '✅ Success');
      console.log('Admin Role:', loginData.data.user.role);
    } else {
      console.log('Admin Login Response:', '❌ Failed');
    }
  } catch (error) {
    console.error('Admin Authentication Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 2: Create an employee user and login
  console.log('2. Setting up employee authentication...');
  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Employee User',
        email: 'employee@example.com',
        password: 'employee123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Employee Register Response:', registerData.success ? '✅ Success' : '❌ Failed');
    
    // Login as employee
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'employee@example.com',
        password: 'employee123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (loginData.success) {
      employeeToken = loginData.data.token;
      console.log('Employee Login Response:', '✅ Success');
      console.log('Employee Role:', loginData.data.user.role);
    } else {
      console.log('Employee Login Response:', '❌ Failed');
    }
  } catch (error) {
    console.error('Employee Authentication Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 3: Test admin creating a user (this will fail if user is not admin)
  console.log('3. Testing admin create user...');
  try {
    const createUserResponse = await fetch(`${baseUrl}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New Manager',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'Manager'
      })
    });
    
    const createUserData = await createUserResponse.json();
    console.log('Create User Response:', createUserData.success ? '✅ Success' : '❌ Failed');
    if (createUserData.success) {
      createdUserId = createUserData.data.id;
      console.log('Created User ID:', createdUserId);
      console.log('Created User Role:', createUserData.data.role);
    } else {
      console.log('Error:', createUserData.message);
    }
  } catch (error) {
    console.error('Create User Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 4: Test admin getting all users
  console.log('4. Testing admin get all users...');
  try {
    const getUsersResponse = await fetch(`${baseUrl}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const getUsersData = await getUsersResponse.json();
    console.log('Get All Users Response:', getUsersData.success ? '✅ Success' : '❌ Failed');
    if (getUsersData.success) {
      console.log('Total Users:', getUsersData.data.pagination.totalUsers);
      console.log('Users:', getUsersData.data.users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      })));
    } else {
      console.log('Error:', getUsersData.message);
    }
  } catch (error) {
    console.error('Get All Users Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 5: Test admin updating a user
  console.log('5. Testing admin update user...');
  if (createdUserId) {
    try {
      const updateUserResponse = await fetch(`${baseUrl}/api/admin/users/${createdUserId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated Manager Name',
          role: 'Employee'
        })
      });
      
      const updateUserData = await updateUserResponse.json();
      console.log('Update User Response:', updateUserData.success ? '✅ Success' : '❌ Failed');
      if (updateUserData.success) {
        console.log('Updated User Name:', updateUserData.data.name);
        console.log('Updated User Role:', updateUserData.data.role);
      } else {
        console.log('Error:', updateUserData.message);
      }
    } catch (error) {
      console.error('Update User Error:', error.message);
    }
  } else {
    console.log('Skipping update test - no user ID available');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 6: Test employee trying to access admin endpoints (should fail)
  console.log('6. Testing employee access to admin endpoints (should fail)...');
  try {
    const unauthorizedResponse = await fetch(`${baseUrl}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${employeeToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const unauthorizedData = await unauthorizedResponse.json();
    console.log('Employee Access Response:', unauthorizedData.success ? '❌ Should have failed' : '✅ Correctly failed');
    console.log('Error Message:', unauthorizedData.message);
  } catch (error) {
    console.error('Unauthorized Access Test Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Step 7: Test without authentication
  console.log('7. Testing without authentication (should fail)...');
  try {
    const noAuthResponse = await fetch(`${baseUrl}/api/admin/users`, {
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
  
  // Step 8: Test validation errors
  console.log('8. Testing validation errors...');
  try {
    const invalidResponse = await fetch(`${baseUrl}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '', // Empty name
        email: 'invalid-email', // Invalid email
        password: '123', // Short password
        role: 'InvalidRole' // Invalid role
      })
    });
    
    const invalidData = await invalidResponse.json();
    console.log('Invalid User Response:', invalidData.success ? '❌ Should have failed' : '✅ Correctly failed');
    console.log('Error Message:', invalidData.message);
  } catch (error) {
    console.error('Validation Test Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  console.log('🎉 Admin endpoint testing completed!');
  console.log('\nNote: To test admin functionality, you may need to manually update a user\'s role to "Admin" in the database.');
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testAdmin().catch(console.error);
} else {
  // Browser environment
  testAdmin().catch(console.error);
}
