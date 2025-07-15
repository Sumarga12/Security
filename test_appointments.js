const fetch = require('node-fetch');

async function testAppointments() {
  try {
    console.log('Testing appointments endpoint...');
    
    // Test without auth first
    const response = await fetch('http://localhost:5000/api/appointments');
    console.log('Response status:', response.status);
    const data = await response.text();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAppointments();

