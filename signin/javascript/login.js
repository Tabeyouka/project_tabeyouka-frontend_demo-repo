(() => {
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
  const passwdToggle = document.querySelector(".passwd-toggle");

  // 오류 메시지를 보여주는 함수
  function showErrorMessage(element, message) {
    element.innerText = message;
    element.style.display = "block";
  }

  // 오류 메시지를 생성하는 함수
  function createErrorMessage() {
    var errorMessage = document.createElement("div");
    errorMessage.className = "error-msg";
    passwdToggle.style.top = "48px";
    return errorMessage;
  }

  // 비밀번호 토글
  const passwdInput = document.querySelector("#passwd-input");

  passwdToggle.addEventListener("click", function () {
    if (passwdInput.type === "password") {
      passwdInput.type = "text";
      passwdToggle.textContent = "숨기기";
    } else {
      passwdInput.type = "password";
      passwdToggle.textContent = "보이기";
    }
  });

  // 서버 통신
  const loginForm = document.querySelector(".signin-form");
  let errorMsg = null; // 오류 메시지 변수를 전역으로 선언

  // 전송 이벤트
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    /* 참고
  const emailInput = document.querySelector("#email-input");
  emailInput.addEventListener("blur", handleEmailBlur);
  */
    const email = emailInput.value;
    const password = passwordInput.value;

    // 이메일 확인 정규식
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !emailRegex.test(email) || !password) {
      if (errorMsg) {
        errorMsg.remove(); // 기존 오류 메시지 삭제
      }
      errorMsg = createErrorMessage(); // 새로운 오류 메시지 생성
      showErrorMessage(errorMsg, "이메일과 비밀번호를 올바르게 입력해주세요.");
      passwordInput.parentNode.appendChild(errorMsg);
      return; // 전송 막기
    }

    // 서버로 전송할 데이터를 객체 형식으로 만듦
    const data = {
      email: email,
      password: password,
    };

    function getCsrfToken() {
      return document.querySelector('meta[name="csrf-token"]').content;
    }

    fetch("http://127.0.0.1:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 응답이 실패했습니다.");
        }

        return response.json();
      })
      .then((result) => {
        // 쿠키 설정
        console.log(result);
        // 세션 아이디와 세션 데이터 가져오기

        // const sessionId = result.session_id;
        // const sessionData = result.session_data; // 수정: user_id가 아닌 session_data 전체

        // // 쿠키 만료 날짜 설정 (1일)
        // const expirationDate = new Date();
        // expirationDate.setDate(expirationDate.getDate() + 1);

        // // 세션 아이디를 쿠키에 설정
        // document.cookie = `session_id=${JSON.stringify(sessionId)}; expires=${expirationDate.toUTCString()}; path=/`;

        // // 세션 데이터를 쿠키에 설정
        // document.cookie = `session_data=${JSON.stringify(sessionData)}; expires=${expirationDate.toUTCString()}; path=/`;

        // 로그인이 성공한 후에 /api/status에 GET 요청
        fetch("http://127.0.0.1:8080/api/status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((statusResponse) => {
            if (!statusResponse.ok) {
              throw new Error("서버 응답이 실패했습니다.");
            }

            return statusResponse.json();
          })
          .then((statusResult) => {
            console.log(statusResult.message);
            // /api/status의 응답을 확인
            if (statusResult.message === "User is logged in") {
              // 사용자가 로그인되어 있는 상태
              console.log("사용자가 로그인되어 있습니다.");
            } else if (statusResult.message === "User is logged out ") {
              // 사용자가 로그인되어 있지 않은 상태
              console.log("사용자가 로그인되어 있지 않습니다.");
            }
          })
          .catch((error) => {
            console.log("api/status 통신 실패", error);
          });
      })
      .catch((error) => {
        // 에러 처리
        console.error("api/login error msg:", error);

        if (errorMsg) {
          errorMsg.remove(); // 기존 오류 메시지 삭제
        }
        errorMsg = createErrorMessage(); // 새로운 오류 메시지 생성
        showErrorMessage(errorMsg, "아이디 또는 비밀번호가 틀렸습니다.");
        passwordInput.parentNode.appendChild(errorMsg);
      });
  });

  // 회원가입 이동
  const signupButton = document.querySelector(".signupButton");
  signupButton.addEventListener("click", () => {
    fetch("/Register/Register.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
        // 로그인.html의 내용을 제거하고 메인.html의 내용 추가
        while (document.documentElement.firstChild) {
          document.documentElement.removeChild(
            document.documentElement.firstChild
          );
        }

        const search_html = document.querySelector("html");
        const head = document.createElement("head");
        const body = document.createElement("body");
        search_html.appendChild(head);
        search_html.appendChild(body);

        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);

        // 메인.html과 관련된 CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.rel = "stylesheet";
        mainStyle.type = "text/css";
        mainStyle.href = "/Register/main.css";
        document.head.appendChild(mainStyle);

        // 메인.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/Register/Register.js";
        document.body.appendChild(mainScript);
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  });
})();
