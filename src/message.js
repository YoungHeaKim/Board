const message = [
  "이메일을 입력해주세요", // 0
  "비밀번호를 입력해주세요", // 1
  "확인 비밀번호를 입력해주세요", // 2
  "이름을 입력해주세요", // 3
  "유저를 입력해주세요", // 4
  "비밀번호와 확인 비밀번호를 똑같이 입력해주세요", // 5
  "아이디 또는 닉네임이 이미 존재합니다.", // 6  
];

const code = [
  200, // 0
  400, // 1
  500, // 2
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