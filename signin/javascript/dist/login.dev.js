"use strict";

// 이메일 입력 필드에 blur 이벤트 핸들러 등록
var emailInput = document.getElementById("email-input");
emailInput.addEventListener("blur", handleEmailBlur); // 비밀번호 입력 필드에 blur 이벤트 핸들러 등록

var passwordInput = document.getElementById("passwd-input");
passwordInput.addEventListener("blur", handlePasswordBlur); // 이메일 유효성 검사

function handleEmailBlur(event) {
  var emailInput = event.target;
  var emailMsg = emailInput.parentNode.querySelector(".error-msg");
  var value = emailInput.value;
  var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!value) {
    if (!emailMsg) {
      emailMsg = createErrorMessage();
      emailInput.parentNode.appendChild(emailMsg);
    }

    showErrorMessage(emailMsg, "이메일을 입력해주세요.");
  } else if (!emailRegex.test(value)) {
    if (!emailMsg) {
      emailMsg = createErrorMessage();
      emailInput.parentNode.appendChild(emailMsg);
    }

    showErrorMessage(emailMsg, "이메일 형식에 맞게 입력해주세요.");
  } else {
    if (emailMsg) {
      emailMsg.remove();
    }
  }
} // 비밀번호 유효성 검사


function handlePasswordBlur(event) {
  var passwordInput = event.target;
  var passwordMsg = passwordInput.parentNode.querySelector(".error-msg");
  var value = passwordInput.value;

  if (!value) {
    if (!passwordMsg) {
      passwordMsg = createErrorMessage();
      passwordInput.parentNode.appendChild(passwordMsg);
    }

    showErrorMessage(passwordMsg, "비밀번호를 입력해주세요.");
  } else {
    if (passwordMsg) {
      passwordMsg.remove();
    }
  }
} // 오류 메시지를 보여주는 함수


function showErrorMessage(element, message) {
  element.innerText = message;
} // 오류 메시지를 생성하는 함수


function createErrorMessage() {
  var errorMessage = document.createElement("div");
  errorMessage.className = "error-msg";
  return errorMessage;
}