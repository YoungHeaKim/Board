const message = [
  "error", // 0
  "success", // 1
];

const code = [
  400, // 0
  200. // 1
];

exports.code = function (num) {
  return code[num];
};

exports.json = function (num, err) {
  const json = { code: code[num], message: message[num] };
  if (num == 1)
    json.err = err;
  return json;
};