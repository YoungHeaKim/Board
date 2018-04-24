const util = {};

util.parseError = function (errors) {
  const parsed = {};
  if (errors.name == 'ValidationError') {
    for (const name in errors.errors) {
      const validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
    parsed.username = { message: "This username already exists!" };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

util.getDate = function (dateObj) {
  if (dateObj instanceof Date)
    return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth() + 1) + "-" + get2digits(dateObj.getDate());
}

util.getTime = function (dateObj) {
  if (dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes()) + ":" + get2digits(dateObj.getSeconds());
}

module.exports = util;

// private functions
function get2digits(num) {
  return ("0" + num).slice(-2);
}