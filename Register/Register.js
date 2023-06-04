const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordCheck = document.querySelector("#passwordCheck");
const nickName = document.querySelector("#nickName");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 이메일 체크 정규식
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/; // 비밀번호 체크 정규식 (영문 숫자 포함 8자리 이상)
const nicknameRegex = /^[a-zA-Z0-9가-힣]{3,15}$/; // 닉네임 체크 정규식 (영,한,숫자 포함 3~15자)

const emailForm = document.querySelector("#email").value;
const passwordForm = document.querySelector("#password").value;
const nickNameForm = document.querySelector("#nickName").value;

// 에러 메세지 set 함수
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".errorMsg");
  errorDisplay.innerHTML = message;
};

// 이메일 체크 함수
email.addEventListener("input", () => {
  console.log(email.value);
  if (email.value === "") {
    setError(email, "이메일을 입력해주세요.");
  } else if (!emailRegex.test(email.value)) {
    setError(email, "올바른 이메일을 입력해주세요.");
  } else {
    setError(email, "");
  }
});

// 비밀번호 체크 함수
password.addEventListener("input", () => {
  console.log(password.value);
  if (password.value === "") {
    setError(password, "비밀번호를 입력해주세요.");
  } else if (!passwordRegex.test(password.value)) {
    setError(password, "비밀번호는 영문 숫자 포함 8자리 이상이어야 합니다.");
  } else {
    setError(password, "");
  }
});

// 비밀번호 2차 체크 함수
passwordCheck.addEventListener("input", () => {
  console.log(passwordCheck.value);
  if (passwordCheck.value === "") {
    setError(passwordCheck, "비밀번호를 다시 입력해주세요.");
  } else if (passwordCheck.value !== password.value) {
    setError(passwordCheck, "비밀번호가 일치하지 않습니다.");
  } else {
    setError(passwordCheck, "");
  }
});

// 닉네임 체크 함수
nickName.addEventListener("input", () => {
  console.log(nickName.value);
  if (nickName.value === "") {
    setError(nickName, "닉네임을 입력해주세요.");
  } else if (!nicknameRegex.test(nickName.value)) {
    setError(nickName, "3~15자 이내의 닉네임을 입력해주세요.");
  } else {
    setError(nickName, "");
  }
});

const subBtn = (e) => {
  const emailForm = email.value;
  const passwordForm = password.value;
  const nickNameForm = nickName.value;

  const userData = {
    email: emailForm,
    password: passwordForm,
    nickname: nickNameForm,
  };

  console.log(userData);
  e.preventDefault();
};

// const password = document.quertSelector("password");
// const passwordCheck = document.quertSelector("passwordCheck");
// const nickName = document.quertSelector("nickName");
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailError = document.quertSelector("errorMsg");

// const email2 = {
//     '0': 'test',
// }
// const emailCheck = () => {
//     const emailForm = document.getElementById('email').value
//     if (emailForm == email[0]) {
//         alert('중복된 이메일 주소가 있습니다');
//         document.getElementById('email').value = '';
//     } else if (emailForm == '') {
//         alert('이메일을 입력해주세요');
//     } else {
//         alert('사용가능한 이메일 입니다');
//     }
// }

// const formCheck = () => {
//   const emailForm = document.getElementById("email").value;
//   // const pwdForm = document.getElementById('pwd').value
//   // const pwdCheckForm = document.getElementById('pwdCheck').value
//   // const nickNameForm = document.getElementById('nickName').value

//   if (emailForm == "") {
//     alert("이메일을 입력해주세요.");
//     return false;
//   }
//   return true;
// };

// const subBtn = () => {
//   if (formCheck()) {
//     alert("회원가입 완료");
//     // 백에 데이터 전송 -form
//   } else {
//     alert("회원가입 실패");
//   }
// };

// const data = {
//     'email': emailForm,
//     'pwd': pwdForm,
//     'pwd2': pwdCheckForm,
//     'nickName': nickNameForm,
// }
