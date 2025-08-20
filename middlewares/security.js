const helmet = require('helmet');

const securityMiddleware = helmet({
  contentSecurityPolicy: false,
});

module.exports = securityMiddleware;
