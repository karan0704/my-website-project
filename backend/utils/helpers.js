// utils/helpers.js - General utility helper functions

const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data && { data }),
  };
};

const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

const logRequest = (method, endpoint, user = "anonymous") => {
  console.log(
    `[${getCurrentTimestamp()}] ${method} ${endpoint} - User: ${user}`
  );
};

module.exports = {
  formatResponse,
  getCurrentTimestamp,
  logRequest,
};
