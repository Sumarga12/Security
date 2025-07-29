const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../activity.log');

function logActivity({ userId, email, action, details }) {
  const entry = {
    timestamp: new Date().toISOString(),
    userId,
    email,
    action,
    details,
  };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n', { encoding: 'utf8', mode: 0o600 });
}

module.exports = { logActivity }; 