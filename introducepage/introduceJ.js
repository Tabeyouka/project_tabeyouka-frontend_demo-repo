const modifyBtn = document.querySelector(".modify-btn");
const modifyCompleteBtn = document.querySelector(".modify-complete-btn");
const noticeText = document.querySelector("#notice-text");

// 댓글 내용 저장하는 객체
let commentData = {};
let commentData2 = {};
let noticeData = [];
let noticeData2 = {};
// 댓글 입력 값을 commentData에 저장
const commentValue = document.querySelector("#comment-input");
commentValue.addEventListener("input", () => {
  commentData.comment_text = commentValue.value;
  console.log(commentData);
  console.log(commentValue.value);
});
document.addEventListener("DOMContentLoaded", () => {
  commentLoad();
  noticeLoad();
  noticeModifiy();
});

const noticeModifiy = () => {
  modifyBtn.addEventListener("click", () => {
    const modifySection = document.querySelector("#notice-content");
    const notice = noticeData[0];
    modifySection.innerHTML = "";
    noticeData.forEach((notice) => {
      const noticeText = document.createElement("div");
      noticeText.id = "modify-text";
      noticeText.textContent = notice.article;
      noticeText.contentEditable = true;
      noticeText.addEventListener("input", () => {
        noticeData2.article = noticeText.textContent;
      });

      const modifyComplete = document.createElement("button");
      modifyComplete.id = "modify-complete-btn";
      modifyComplete.textContent = "수정완료";
      modifyComplete.onclick = modifyCompleted;

      modifySection.appendChild(noticeText);
      modifySection.appendChild(modifyComplete);
    });
  });
};

const modifyCompleted = () => {
  fetch(`http://localhost:8080/api/localsemester`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json ",
    },
    body: JSON.stringify(noticeData2),
  })
    .then((response) => {
      // 처리 완료 후에 수행할 작업
      // 예: 응답 확인, 페이지 리디렉션 등
      console.log("응답 받음:", response);
      // 원하는 작업을 여기에 추가하세요.
      location.reload();
    })
    .catch((error) => {
      // 오류 처리
      console.error("오류 발생:", error);
    });
};
// // 댓글 달기
const commentCreateBtn = () => {
  // location.reload(); // commentLoad 함수 호출

  fetch(`http://localhost:8080/api/localsemestercomments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json ",
    },
    body: JSON.stringify(commentData),
  })
    .then((response) => {
      // 처리 완료 후에 수행할 작업
      // 예: 응답 확인, 페이지 리디렉션 등
      console.log("응답 받음:", response);
      // 원하는 작업을 여기에 추가하세요.
      commentLoad();
    })
    .catch((error) => {
      // 오류 처리
      console.error("오류 발생:", error);
    });
  commentLoad();
  commentValue.value = "";
};

// // 댓글 html 생성
const createComments = () => {
  const commentsSection = document.querySelector(".comments");
  commentsSection.innerHTML = "";

  // 주어진 데이터를 반복하여 댓글 요소를 생성하고 추가
  commentData2.forEach((comment) => {
    const replyText = document.createElement("div");
    replyText.className = "reply-text01";

    const replyBody = document.createElement("div");
    replyBody.className = "reply-body";

    const replyName = document.createElement("h4");
    replyName.className = "reply-name";
    replyName.textContent = comment.id;

    const replyContent = document.createElement("p");
    replyContent.className = "reply-content";
    replyContent.textContent = comment.comment_text;

    commentsSection.appendChild(replyText);
    replyText.appendChild(replyBody);
    replyBody.appendChild(replyName);
    replyBody.appendChild(replyContent);
  });
};

// // 댓글내용 불러오기
const commentLoad = () => {
  fetch("http://localhost:8080/api/localsemestercomments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("데이터를 가져오는데 실패했습니다.");
      }
    })
    .then((data) => {
      console.log("응답 받음:", data);
      commentData2 = data;
      console.log(commentData2);
      // 여기에서 데이터를 활용하여 원하는 작업을 수행할 수 있습니다.
      // 예를 들어, 가져온 데이터를 변수에 저장하거나 특정 요소에 표시하는 등의 작업을 수행할 수 있습니다.

      createComments(); // fetch 완료 후 댓글 생성 함수 호출
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });
};

//현지학기제 내용 불러오기
const noticeLoad = () => {
  fetch("http://localhost:8080/api/localsemester", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("데이터를 가져오는데 실패했습니다.");
      }
    })
    .then((data) => {
      console.log("응답 받음:", data);
      noticeData = [data];
      console.log(noticeData);

      createText();
    })

    .catch((error) => {
      console.error("오류 발생:", error);
    });
};

// 현지학기제 html 생성
const createText = () => {
  const noticeContent = document.querySelector("#notice-content");

  // 주어진 데이터를 반복하여 댓글 요소를 생성하고 추가
  noticeData.forEach((notice) => {
    const noticeText = document.createElement("div");
    noticeText.className = "notice-body";
    noticeText.textContent = notice.article;
    noticeContent.appendChild(noticeText);
  });
};

// document.addEventListener("DOMContentLoaded", commentLoad());

// const createNoticeText = () => {
//   const noticeSection = document.querySelector(".notice-content");
// };
// commentLoad(); // 페이지 진입 시 댓글 데이터를 로드하고 생성하는 함수 호출
