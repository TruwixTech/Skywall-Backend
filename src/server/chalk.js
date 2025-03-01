// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m", 
  red: "\x1b[31m",
  blue: "\x1b[34m"
};

// Create our own simplified version of chalk
const getReq = (method) => `${colors.green}${method}${colors.reset}`;
const postReq = (method) => `${colors.yellow}${method}${colors.reset}`;
const errorReq = (method) => `${colors.red}${method}${colors.reset}`;
const infoReq = (method) => `${colors.blue}${method}${colors.reset}`;

// Export in CommonJS style
module.exports = {
  getReq,
  postReq,
  errorReq,
  infoReq
};