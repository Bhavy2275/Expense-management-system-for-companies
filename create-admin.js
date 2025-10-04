// Script to create an admin user for testing
// Run this after starting the server with: npm run dev

const createAdminUser = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔧 Creating Admin User for Testing\n');
  
  try {
    // Step 1: Register a regular user
    console.log('1. Registering a regular user...');
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'System Admin',
        email: 'admin@company.com',
        password: 'admin123456'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Register Response:', registerData.success ? '✅ Success' : '❌ Failed');
    
    if (registerData.success) {
      console.log('User ID:', registerData.data.id);
      console.log('Email:', registerData.data.email);
      console.log('Role:', registerData.data.role);
      
      console.log('\n' + '='.repeat(50) + '\n');
      console.log('⚠️  IMPORTANT: To make this user an admin, you need to:');
      console.log('1. Connect to your MongoDB database');
      console.log('2. Find the user with email: admin@company.com');
      console.log('3. Update the role field from "Employee" to "Admin"');
      console.log('\nMongoDB command:');
      console.log('db.users.updateOne({email: "admin@company.com"}, {$set: {role: "Admin"}})');
      console.log('\n' + '='.repeat(50) + '\n');
      
      // Step 2: Login to verify
      console.log('2. Testing login...');
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
        console.log('Login Response:', '✅ Success');
        console.log('Token:', loginData.data.token.substring(0, 20) + '...');
        console.log('Current Role:', loginData.data.user.role);
        
        if (loginData.data.user.role === 'Admin') {
          console.log('\n🎉 User is already an admin! You can now test admin endpoints.');
        } else {
          console.log('\n⚠️  User is not an admin yet. Please update the role in the database.');
        }
      } else {
        console.log('Login Response:', '❌ Failed');
        console.log('Error:', loginData.message);
      }
    } else {
      console.log('Error:', registerData.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  console.log('📝 Alternative: Use MongoDB Compass or mongo shell:');
  console.log('1. Connect to your database');
  console.log('2. Navigate to the "users" collection');
  console.log('3. Find the user you want to make admin');
  console.log('4. Edit the "role" field to "Admin"');
  console.log('5. Save the changes');
};

// Run the script if this is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  createAdminUser().catch(console.error);
} else {
  // Browser environment
  createAdminUser().catch(console.error);
}
