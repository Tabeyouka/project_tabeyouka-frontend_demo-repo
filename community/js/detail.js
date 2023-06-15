// input 요소 클릭 이벤트
const input = document.querySelectorAll('.form-control');

input.forEach(function(element) {
    // 클릭 시 주황색 실선 표시
    element.addEventListener('click', function() {
        this.style.borderBottom = '3px solid orange';
    });
    // 클릭해제 시 실선 제거
    element.addEventListener('blur', function() {
        this.style.borderBottom = 'none';
    });
});


/* 날짜 형식 변환 함수 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* 게시글의 제목 */
const title = document.querySelector('.title b');

/* 게시글 작성자 */
const writer = document.querySelector('.writer');

/* 게시글 작성 일자 */
const date = document.querySelector('.date');

/* 게시글 내용 */
const content = document.querySelector('.content');

const postId = localStorage.getItem("postId");
const commentId = localStorage.getItem("commentId");

fetch(`http://127.0.0.1:8080/api/community/${postId}`, {
  headers: {
    "Content-Type": "application/json",
  },
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    // 게시물 정보를 사용하여 페이지의 요소를 업데이트합니다.
    console.log(data);

    title.innerHTML = data.post.title
    date.textContent = data.post.created_at;
    content.textContent = data.post.text;
    image.src = data.post.image;
  })
  .catch((error) => {
    console.error("API 요청 중 오류가 발생했습니다:", error);
});

/* 게시글 목록 버튼: 누르면 게시글 목록 페이지로 넘어감 */
const listBtn = document.querySelector('.list');

listBtn.addEventListener("click", () => {
  fetch("../community/list.html", { credentials: "include" })
    .then((response) => response.text())
    .then((html) => {
      // 해당 html 내용 제거 후 변경할 html로 내용 변경
      document.documentElement.innerHTML = "";

      const range = document.createRange();
      const parsedHTML = range.createContextualFragment(html);
      document.body.appendChild(parsedHTML);

      const appContainer = document.querySelector(".app-container");

      // CSS 파일 추가
      const mainStyle = document.createElement("link");
      mainStyle.rel = "stylesheet";
      mainStyle.href = "../community/css/list.css";
      document.head.appendChild(mainStyle);

      // JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "../community/js/list.js";
      mainScript.type = "text/javascript"; // MIME 유형 설정
      document.body.appendChild(mainScript);
    })
    .catch((error) => {
      console.error("에러:", error);
    });
});

/* 게시글 수정 버튼: 누르면 게시글 수정 페이지로 넘어감 */
const modifyBtn = document.querySelector('.modify');
modifyBtn.addEventListener("click", () => {
  fetch("../community/postModify.html", { credentials: "include" })
    .then((response) => response.text())
    .then((html) => {
      // 해당 html 내용 제거 후 변경할 html로 내용 변경
      document.documentElement.innerHTML = "";

      const range = document.createRange();
      const parsedHTML = range.createContextualFragment(html);
      document.body.appendChild(parsedHTML);

      const appContainer = document.querySelector(".app-container");

      // CSS 파일 추가
      const mainStyle = document.createElement("link");
      mainStyle.rel = "stylesheet";
      mainStyle.href = "../community/css/post.css";
      document.head.appendChild(mainStyle);

      // JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "../community/js/postModify.js";
      mainScript.type = "text/javascript"; // MIME 유형 설정
      document.body.appendChild(mainScript);
    })
    .catch((error) => {
      console.error("에러:", error);
    });
});


/* 게시글 삭제 버튼: 누르면 게시글 삭제 알림창을 띄운 뒤 확인/취소 여부에 따라 게시글을 삭제함 */
const deleteBtn = document.querySelector('.delete');
console.log(deleteBtn);

deleteBtn.addEventListener('click', () => {
  let checkDelete = confirm('정말로 게시글을 삭제하시겠습니까?');
  if(checkDelete) {
    fetch(`http://localhost:8080/api/community/${postId}`, {
      method: 'DELETE', 
      headers: { "Content-Type": "application/json"}
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      alert('게시글이 삭제되었습니다.');
    })
    .catch(err => {
      console.log("오류 발생: ", err);
      alert('게시글 삭제에 실패하였습니다.');
    });
  } 
})

/* 게시글 댓글 정보: 게시글 작성자, 게시글 작성 일자가 들어감 */
const commentInfo = document.querySelector('.comment-info p');
const commentContent = document.querySelector('.comment-content');
fetch(`http://localhost:8080/api/post/${postId}/comments`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
})
.then((res) => res.json())
.then((data) => {
  commentInfo.textContent = `${data.comments.author_id} ${data.comments.created_at}`;
  commentContent.textContent = `${data.comments.text}`;
})

/* 등록할 댓글 내용 */
const commentInputValue = document.querySelector('.comment-input').value;

/* 댓글 등록 버튼 : 새 댓글이 등록될 때마다 댓글을 하나씩 추가함 */
const registerBtn = document.querySelector('.com-register-btn');

registerBtn.addEventListener('click', () => {
  fetch(`http://localhost:8080/api/post/${postId}/comments`, 
  { method: "POST",
    headers: { "Content-Type": "application/json"},
    body: {
      text: commentInputValue
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log("댓글 등록: ", data);
    alert('댓글이 등록되었습니다.')
    createComments();
  })
  .catch(err => {
    console.log("오류 발생: ", err);
    alert('댓글 등록에 실패하였습니다.')
  })
})

document.addEventListener("DOMContentLoaded", () => {
  commentLoad();
});

const createComments = () => {
  const commentsSection = document.querySelector(".comments-container");
  commentsSection.innerHTML = "";

  // 주어진 데이터를 반복하여 댓글 요소를 생성하고 추가
  commentData.forEach((comment) => {
    const createCommentContainer = document.createElement("div");
    createCommentContainer.className = "comment";

    const createCommentInfo = document.createElement("div");
    createCommentInfo.className = "comment-info";
    createCommentInfo.textContent = comment.author_id ? comment.author_id : "Unknown";

    const createCommentContent = document.createElement("p");
    createCommentContent.className = "comment-content";
    createCommentContent.textContent = comment.text;

    commentsSection.appendChild(createCommentContainer);
    createCommentContainer.appendChild(createCommentInfo);
    createCommentContainer.appendChild(createCommentContent);
  });
};

let commentData = {};
const commentLoad = () => {
  fetch(`http://localhost:8080/api/post/${postId}/comments`, { 
    method: "GET",
    headers: { "Content-Type": "application/json"},
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("데이터를 가져오는데 실패했습니다.");
    }
  })
  .then(data => {
    console.log("응답 받음:", data);
    commentData = data;
    console.log(commentData);
    createComments(); // fetch 완료 후 댓글 생성 함수 호출
  })
  .catch(err => {
    console.error("오류 발생:", error);  
  })
}

// 버튼 클릭 이벤트 핸들러
const modal = document.querySelector('.modal');
const comModifyBtn = document.querySelector('.com-modify-btn');
comModifyBtn.addEventListener('click', function() {
  modal.style.display = 'block';
});

// 모달 닫기 버튼 클릭 이벤트 핸들러
const closeBtn = document.querySelector('.btn-close');
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});


let modifiedCommentValue = document.querySelector('.modifiedComment').value;

/* 댓글 수정 모달 창의 input 태그에 입력된 내용으로 댓글을 수정함 */
const comModifyBtn2 = document.querySelector('.com-modify-btn2');
comModifyBtn2.addEventListener('submit', (event) => {
  event.preventDefault();
  let checkModify = confirm('수정하시겠습니까?');
  if(checkModify){  
    fetch(`http://127.0.0.1/api/post/${postId}/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        text: modifiedCommentValue
      }
    })
    .then(res => {
      alert('수정되었습니다.');
    })
    .catch(err => {
      alert('수정에 실패하였습니다.');
    })
  }
})


const comDeleteBtn = document.querySelector('.com-delete-btn');
console.log(comDeleteBtn);
comDeleteBtn.addEventListener('click', () => {
confirm('정말로 게시글을 삭제하시겠습니까?');
  if(checkDelete) {
    fetch(`http://127.0.0.1/api/post/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => alert('삭제되었습니다.'))
    .catch(err => alert('삭제에 실패하였습니다.'));
  }
})