const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordCheck = document.querySelector("#passwordCheck");
const nickName = document.querySelector("#nickName");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 이메일 체크 정규식
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/; // 비밀번호 체크 정규식 (영문 숫자 포함 8자리 이상)
const nicknameRegex = /^[a-zA-Z0-9가-힣]{3,15}$/; // 닉네임 체크 정규식 (영,한,숫자 포함 3~15자)

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
// 유저 정보를 서버로 전송
const sendDataToServer = () => {
  const userData = {
    email: email.value,
    password: password.value,
    nickname: nickName.value,
  };

  // 서버로 POST 요청 보내기
  fetch("http://localhost:8080/api/register ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      // 처리 완료 후에 수행할 작업
      // 예: 응답 확인, 페이지 리디렉션 등
      console.log("응답 받음:", response);
      // 원하는 작업을 여기에 추가하세요.
    })
    .catch((error) => {
      // 오류 처리
      console.error("오류 발생:", error);
    });
};

// 유저 정보 전송 버튼 클릭 이벤트 리스너
const submitButton = document.querySelector(".submitBtn");
submitButton.addEventListener("click", (e) => {
  e.preventDefault(); // 폼 제출 기본 동작 막기
  sendDataToServer();
});
