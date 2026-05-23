const http = require('http');
const body = JSON.stringify({
  name: 'Postman User',
  email: 'postman.user@example.com',
  password: 'Password123!'
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('headers', res.headers);
    console.log('body', data);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('request error', err);
  process.exit(1);
});

req.write(body);
req.end();
