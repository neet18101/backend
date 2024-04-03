// utils.js
function convertObjectToLowerCase(obj) {
    if (obj && typeof obj === 'object') {
      const convertedObj = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const newKey = key.toLowerCase();
        const newValue = typeof value === 'string' ? value.toLowerCase() : value;
        convertedObj[newKey] = newValue;
      });
      return convertedObj;
    }
    return obj;
  }
  
  module.exports = { convertObjectToLowerCase };
  