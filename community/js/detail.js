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

/* fetch 함수를 사용할 일이 많아 fetchData 함수로 사용 */
// url, method, headers, body를 파라미터로 받아 method, headers, body를 options 객체로 묶어 fetch 함수로 전달
const fetchData = (url, method, headers = { }, body) => {
  const options = {
    method: method,
    headers: headers,
    body: body
  }

  return fetch(url, options)
  .then((res) => {
    return res.json();
  })
  .catch((err) => console.log('오류 발생: ', err))
}

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

const postIds = [];

/* 게시글 id를 가져올 방법? */
fetchData("http://localhost:8080/api/community", "GET", 
{ "Content-Type": "application/json"})
.then(data => {
  postIds = data.posts.map((post) => post.id);
})


/* 게시글 정보를 가져옴 */
postIds.forEach(() => {
  fetchData(`http://localhost:8080/api/community/${postId}`, "GET",
  { "Content-Type": "application/json"})
  .then(data => {
    console.log(data);

    // const post = 

    // title.textContent = data.posts.data[0].title;
    // writer.textContent = data.posts.data[0].author_id ? data.posts.data[0].author_id : "이름 없는 사용자";
    // date.textContent = formatDate(data.posts.data[0].created_at);
    // content.textContent = data.posts.data[0].text;
  })
  .catch(err => console.log("오류 발생:", err));
  }
)


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

deleteBtn.addEventListener('click', () => {
  let question = confirm('정말로 게시글을 삭제하시겠습니까?');
  if(question) {
    fetchData(`http://localhost:8080/api/community/${community}`, 'DELETE', 
    { "Content-Type": "application/json"})
    .then(res => {
      r
      console.log(res);
      alert('게시글이 삭제되었습니다.');
    })
    .catch(err => {
      console.log("오류 발생: ", err);
      alert('게시글 삭제에 실패하였습니다.');
    });

    // 삭제된 게시글을 list.html에서 삭제함(로직 추가 예정)
    /* 게시글이 삭제되면 삭제된 게시글의 id를 배열에 저장
       if. 게시글의 id가 해당 배열에 있다면 해당 id를 가진 게시글을 보여주는 dom 요소를 게시글 목록에서 삭제

    */
  } 
})

/* 게시글 댓글 정보: 게시글 작성자, 게시글 작성 일자가 들어감 */
const commentInfo = document.querySelector('.comment-info p');
const commentContent = document.querySelector('.comment-content');
fetchData("http://localhost:8080/api/community/{community}/comments", "GET", 
{"Content-Type": "application/json"})
.then(res => {
  console.log(res);

  commentInfo.textContent = `${res.comments.author_id} ${res.comments.created_at}`;
  commentContent.textContent = `${res.comments.text}`;
})

/* 등록할 댓글 내용 */
const commentInput = document.querySelector('.comment-input');

const createComments = () => {
  const commentsSection = document.querySelector(".comments-container");
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


/* 댓글 등록 버튼 : 새 댓글이 등록될 때마다 하나씩 추가함 */
const registerBtn = document.querySelector('.com-register-btn');

registerBtn.addEventListener('click', () => {
  fetchData("http://localhost:8080/api/community/{community}/comments", "POST",
  { "Content-Type": "application/json"}, commentInput.value)
  .then(res => {
    console.log("댓글 등록: ", res);

  })
  .catch(err => {
    console.log("오류 발생: ", err);
    alert('댓글 등록에 실패하였습니다.')
  })
})

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

const modifiedCommentValue = document.querySelector('.modifiedComment').value;
const modifiedComment = {
  text : modifiedCommentValue
};

/* 댓글 수정 모달 창의 input 태그에 입력된 내용으로 댓글을 수정함 */
const comModifyBtn2 = document.querySelector('.com-modify-btn2');
comModifyBtn2.addEventListener('submit', (event) => {
  event.preventDefault();
  let checkModify = confirm('수정하시겠습니까?');
  if(checkModify){  
    fetchData("http://localhost:8080/api/community/{community}/comments/{comment}", "PUT", 
    {"Content-Type": "application/json"}, JSON.stringify(modifiedComment))
    .then(res => {
      if(!res.ok) {
        throw new Error('서버 응답이 실패했습니다.');
      }
      console.log('수정되었습니다.');
    })
    .catch(err => console.log("오류 발생: ", err));
  }
})

const comDeleteBtn = document.querySelector('.com-delete-btn');
comDeleteBtn.addEventListener('click', () => {
  let checkDelete = confirm('정말로 댓글을 삭제하시겠습니까?');
  if(checkDelete) {
    fetchData("http://localhost:8080/api/community/{community}/comments/{comment}", 
    "GET", {"Content-Type" : "application/json"}, )
    .then(res => {
      console.log(res);
      alert('댓글이 삭제되었습니다.');
    })
    .catch(err => console.log('오류 발생', err));
  }
})
