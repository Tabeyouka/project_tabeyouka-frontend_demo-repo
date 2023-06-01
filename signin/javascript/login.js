// 이메일 입력 필드에 blur 이벤트 핸들러 등록
const emailInput = document.querySelector("#email-input");
emailInput.addEventListener("blur", handleEmailBlur);

// 비밀번호 입력 필드에 blur 이벤트 핸들러 등록
const passwordInput = document.querySelector("#passwd-input");
passwordInput.addEventListener("blur", handlePasswordBlur);

// 이메일 유효성 검사
function handleEmailBlur(event) {
  var emailMsg = event.target.parentNode.querySelector(".error-msg");

  var value = event.target.value;
  var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!value) {
    if (!emailMsg) {
      emailMsg = createErrorMessage();
      event.target.parentNode.appendChild(emailMsg);
    }
    showErrorMessage(emailMsg, "이메일을 입력해주세요.");
  } else if (!emailRegex.test(value)) {
    if (!emailMsg) {
      emailMsg = createErrorMessage();
      event.target.parentNode.appendChild(emailMsg);
    }
    showErrorMessage(emailMsg, "이메일 형식에 맞게 입력해주세요.");
  } else {
    if (emailMsg) {
      emailMsg.remove();
    }
  }
}

// 비밀번호 유효성 검사
function handlePasswordBlur(event) {
  var passwordMsg = event.target.parentNode.querySelector(".error-msg");

  var value = event.target.value;

  if (!value) {
    if (!passwordMsg) {
      passwordMsg = createErrorMessage();
      event.target.parentNode.appendChild(passwordMsg);
    }
    showErrorMessage(passwordMsg, "비밀번호를 입력해주세요.");
  } else {
    if (passwordMsg) {
      passwordMsg.remove();
    }
  }
}

// 토글 선택자(오류 메시지 노출 시 위치 조정, 비밀번호 토글 사용)
const passwdToggle = document.querySelector('.passwd-toggle');

// 오류 메시지를 보여주는 함수
function showErrorMessage(element, message) {
  element.innerText = message;
  element.style.display = "block";
}

// 오류 메시지를 생성하는 함수
function createErrorMessage() {
  var errorMessage = document.createElement("div");
  errorMessage.className = "error-msg";
  passwdToggle.style.top = "48px"
  return errorMessage;
}

// 비밀번호 토글
const passwdInput = document.querySelector('#passwd-input');

passwdToggle.addEventListener('click', function() {
  if (passwdInput.type === 'password') {
    passwdInput.type = 'text';
    passwdToggle.textContent = '숨기기';
  } else {
    passwdInput.type = 'password';
    passwdToggle.textContent = '보이기';
  }
});



// 서버 통신
const loginForm = document.querySelector('.signin-form');
let errorMsg = null; // 오류 메시지 변수를 전역으로 선언

loginForm.addEventListener('submit', event => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || !emailRegex.test(email) || !password) {
    if (errorMsg) {
      errorMsg.remove(); // 기존 오류 메시지 삭제
    }
    errorMsg = createErrorMessage(); // 새로운 오류 메시지 생성
    showErrorMessage(errorMsg, '이메일과 비밀번호를 올바르게 입력해주세요.');
    passwordInput.parentNode.appendChild(errorMsg);
    return; // 전송 막기
  }

  // 서버로 전송할 데이터를 객체 형식으로 만듦
  const data = {
    email: email,
    password: password
  };

  fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('서버 응답이 실패했습니다.');
      }
      return response.json();
    })
    .then(result => {
      // 서버 응답 처리
      console.log(result);

      // 로그인 성공 시 SPA로 main 페이지 요소들을 보여줌
      fetch("./../main/main.html")
      .then((response) => response.text())
      .then((html) => {
        // login.html 내용 제거 및 main.html 내용 추가
        document.documentElement.innerHTML = "";
    
        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);
    
        const appContainer = document.querySelector(".app-container");
    
        // main.html과 관련된 CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.rel = "stylesheet";
        mainStyle.href = "../../main/main.css";
        document.head.appendChild(mainStyle);
    
        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "../../main/main.js";
        document.body.appendChild(mainScript);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    })
    .catch(error => {
      // 에러 처리
      console.error('Error:', error);

      if (errorMsg) {
        errorMsg.remove(); // 기존 오류 메시지 삭제
      }
      errorMsg = createErrorMessage(); // 새로운 오류 메시지 생성
      showErrorMessage(errorMsg, '아이디 또는 비밀번호가 틀렸습니다.');
      passwordInput.parentNode.appendChild(errorMsg);
    });
});