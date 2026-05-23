const dbModule = require('./db');
const authService = require('./services/authService');
(async () => {
  try {
    await dbModule.connect();
    const result = await authService.register({
      name: 'Test User',
      email: 'test.user+tmp@example.com',
      password: 'Password123!'
    }, '127.0.0.1', 'PostmanRuntime/9.0');
    console.log('signup result', result);
  } catch (err) {
    console.error('signup failed', err);
  } finally {
    process.exit(0);
  }
})();
