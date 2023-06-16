(() => {
  // input 요소 클릭 이벤트 
  let input = document.querySelector('.form-control');

  // 클릭 시 주황색 실선 표시
  input.addEventListener('click', function() {
    this.style.borderBottom = '3px solid orange';
  });
  // 클릭해제 시 실선 제거
  input.addEventListener('blur', function() {
    this.style.borderBottom = 'none';
  });   

  /* 날짜 형식 변환 함수 */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /* 게시글의 제목 */
  const title = document.querySelector(".title b");

  /* 게시글 작성자 */
  const writer = document.querySelector(".writer");

  /* 게시글 작성 일자 */
  const date = document.querySelector(".date");

  /* 게시글 내용 */
  const content = document.querySelector(".content");

  var postId = localStorage.getItem("postId");

  fetch(`http://127.0.0.1:8080/api/community/${postId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      // 게시물 정보를 사용하여 페이지의 요소를 업데이트
      console.log(data);

      title.innerHTML = data.post.title;
      writer.innerHTML = data.post.nickname ? data.post.nickname : "Unknown";
      date.textContent = formatDate(data.post.created_at);
      content.textContent = data.post.text;
      image.src = data.post.image;
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });

  /* 게시글 목록 버튼: 누르면 게시글 목록 페이지로 넘어감 */
  const listBtn = document.querySelector(".list");

  listBtn.addEventListener("click", () => {
    fetch("../community/list.html", { credentials: "include" })
      .then((response) => response.text())
      .then((html) => {
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

        const mainStyle = document.createElement("link");
        mainStyle.rel = "stylesheet";
        mainStyle.href = "../community/css/list.css";
        document.head.appendChild(mainStyle);

        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "../community/js/list.js";
        document.body.appendChild(mainScript);

        let login_state = localStorage.getItem("loginState");
        // login_state가 "login"일때 로그아웃 생성
        if (login_state === "login") {
          // 로그인택스트 변경
          const loginText = document.querySelector(".loginText");
          loginText.innerHTML = "로그아웃";
          // 로그아웃 컨테이너 클래스명 변경
          const loginContainer = document.querySelector(".loginContainer");
          loginContainer.classList = "logoutContainer";
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  });

  /* 게시글 수정 버튼: 누르면 게시글 수정 페이지로 넘어감 */
  const modifyBtn = document.querySelector(".post-modify");
  modifyBtn.addEventListener("click", () => {
    fetch("../community/postModify.html", { credentials: "include" })
      .then((response) => response.text())
      .then((html) => {
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

        const mainStyle = document.createElement("link");
        mainStyle.rel = "stylesheet";
        mainStyle.href = "../community/css/post.css";
        document.head.appendChild(mainStyle);

        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "../community/js/postModify.js";
        document.body.appendChild(mainScript);

        let login_state = localStorage.getItem("loginState");
        // login_state가 "login"일때 로그아웃 생성
        if (login_state === "login") {
          // 로그인택스트 변경
          const loginText = document.querySelector(".loginText");
          loginText.innerHTML = "로그아웃";
          // 로그아웃 컨테이너 클래스명 변경
          const loginContainer = document.querySelector(".loginContainer");
          loginContainer.classList = "logoutContainer";
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  });

  /* 게시글 삭제 버튼: 누르면 게시글 삭제 알림창을 띄운 뒤 확인/취소 여부에 따라 게시글을 삭제함 */
  const deleteBtn = document.querySelector(".post-delete");
  console.log(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    let checkDelete = confirm("정말로 게시글을 삭제하시겠습니까?");
    if (checkDelete) {
      fetch(`http://localhost:8080/api/community/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert("게시글이 삭제되었습니다. 게시판 리스트로 이동합니다.");

          // 삭제 후 게시판 이동
          fetch("../community/list.html", { credentials: "include" })
            .then((response) => response.text())
            .then((html) => {
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

              const mainStyle = document.createElement("link");
              mainStyle.rel = "stylesheet";
              mainStyle.href = "../community/css/list.css";
              document.head.appendChild(mainStyle);

              // main.html과 관련된 JavaScript 파일 추가
              const mainScript = document.createElement("script");
              mainScript.src = "../community/js/list.js";
              document.body.appendChild(mainScript);

              let login_state = localStorage.getItem("loginState");
              // login_state가 "login"일때 로그아웃 생성
              if (login_state === "login") {
                // 로그인택스트 변경
                const loginText = document.querySelector(".loginText");
                loginText.innerHTML = "로그아웃";
                // 로그아웃 컨테이너 클래스명 변경
                const loginContainer = document.querySelector(".loginContainer");
                loginContainer.classList = "logoutContainer";
              }
            })
            .catch((error) => {
              console.error("에러:", error);
            });
        })
        .catch((err) => {
          console.log("오류 발생: ", err);
          alert("게시글 삭제에 실패하였습니다.");
        });
    }
  });

  ////////////////////////////////////////////////////////////////////////////
  /* 게시글 댓글 정보: 게시글 작성자, 게시글 작성 일자가 들어감 */
  const commentInfo = document.querySelector(".comment-info p");
  const commentContent = document.querySelector(".comment-content");
  fetch(`http://localhost:8080/api/post/${postId}/comments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      commentInfo.textContent = `${data.comments.author_id} ${data.comments.created_at}`;
      commentContent.textContent = `${data.comments.text}`;
    });

  /* 댓글 등록 버튼 : 새 댓글이 등록될 때마다 댓글을 하나씩 추가함 */
  const registerBtn = document.querySelector(".com-register-btn");
  registerBtn.addEventListener("click", () => {
    /* 등록할 댓글 내용 */
    const commentInput = document.getElementById("text");
    const comment = commentInput.value;

    /* JSON 데이터로 만들기 */
    const postCommentData = {
      text: comment,
    };

    const jsonData = JSON.stringify(postCommentData);

/* fetch로 댓글 등록 */
fetch(`http://localhost:8080/api/post/${postId}/comments`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: jsonData,
})
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("데이터를 가져오는데 실패했습니다.");
    }
  })
  .then((data) => {
    const commentId = data.id;
    localStorage.setItem("commentId", commentId);
    alert('등록되었습니다.');
    comment = '';
  })
  .catch((err) => {
    console.log("오류 발생: ", err);
    alert("댓글 등록에 실패하였습니다.");
  });
});

/* 댓글을 불러올 때 댓글들을 입력받을 객체 */
let commentData = {};

document.addEventListener("DOMContentLoaded", () => {
commentLoad();
});

/* 댓글을 불러오는 함수 */
const commentLoad = () => {
fetch(`http://localhost:8080/api/post/${postId}/comments`, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => {
    if (res.ok) {
      return response.json();
    } else {
      throw new Error("데이터를 가져오는데 실패했습니다.");
    }
  })
  .then((data) => {
    console.log("응답 받음:", data);
    commentData = data;
    createComments(); // fetch 완료 후 댓글 생성 함수 호출
  })
  .catch((err) => {
    console.error("오류 발생:", err);
  });
};

/* 댓글 폼 만드는 함수 */
const createComments = () => {
const commentsSection = document.querySelector(".comment");
commentsSection.innerHTML = "";

// 주어진 데이터를 반복하여 댓글 요소를 생성하고 추가

commentData.forEach((comment) => {
  commentsSection.innerHTML = ''; 
    const commentInfo = document.createElement("div");
    commentInfo.className = "comment-info";
    
    const commentAuthorDate = document.createElement("p");
    commentAuthorDate.textContent = `${comment.author_id} ${comment.created_at}`;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const comModifyBtn = document.createElement("button");
    comModifyBtn.className = "btn btn-light com-modify-btn";
    comModifyBtn.textContent = "수정"

    const modal = document.createElement("div");
    modal.tabIndex = -1;
    modal.innerHTML = 
    ` <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">댓글 수정</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
                aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <input type="text" class="modified-comment" placeholder="댓글을 입력하세요">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary com-modify-btn2">수정</button>
        </div>
      </div>
    </div>`

    const buttonContainer2 = document.createElement("div");
    buttonContainer.className = "button-container2";

    const comDeleteBtn = document.createElement("button");
    comDeleteBtn.className = "btn btn-light com-delete-btn";

    const commentContent = document.createElement("div");
    commentContent.className = "comment-content";
    commentContent.textContent = `${comment.text}`;

    commentsSection.appendChild(commentInfo);
    commentInfo.appendChild(commentAuthorDate);
    commentInfo.appendChild(buttonContainer);
    buttonContainer.appendChild(comModifyBtn);
    buttonContainer.appendChild(modal);
    commentInfo.appendChild(buttonContainer2);
    buttonContainer2.appendChild(comDeleteBtn);
    commentsSection.appendChild(commentContent);
  });
};


  // 모달 열기 버튼 클릭 이벤트 핸들러
  const modal = document.querySelector(".modal");
  const comModifyBtn = document.querySelector(".com-modify-btn");
  comModifyBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // 모달 닫기 버튼 클릭 이벤트 핸들러
  const closeBtn = document.querySelector(".btn-close");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  let modifiedCommentValue = document.querySelector(".modified-comment").value;

  /* 댓글 수정 모달 창의 input 태그에 입력된 내용으로 댓글을 수정함 */
  const comModifyBtn2 = document.querySelector(".com-modify-btn2");
  comModifyBtn2.addEventListener("click", (event) => {
    event.preventDefault();
    let checkModify = confirm("수정하시겠습니까?");
    if (checkModify) {
      fetch(`http://127.0.0.1/api/post/${postId}/comments/{comment}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          text: modifiedCommentValue,
        },
      })
        .then((res) => {
          alert("수정되었습니다.");
        })
        .catch((err) => {
          alert("수정에 실패하였습니다.");
        });
    }
  });

  const comDeleteBtn = document.querySelector(".com-delete-btn");
  console.log(comDeleteBtn);
  comDeleteBtn.addEventListener("click", () => {
    confirm("정말로 댓글을 삭제하시겠습니까?");
    if (checkDelete) {
      fetch(`http://127.0.0.1/api/post/${postId}/comments/{comment}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => alert("삭제되었습니다."))
        .catch((err) => alert("삭제에 실패하였습니다."));
    }
  });


// 검색시 화면전환

const submit = document.querySelector("#inputForm");
submit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const search_word = input.value;
  
  async function requestSearch() {
    const response = await fetch(`http://localhost:8080/api/restaurants`, {
      method: "GET",
    });
    const data = await response.json();

    const search_complete = filterArrayByWord(data, search_word);

    return search_complete;
  }
  const searchResults = await requestSearch();

  fetch("/search/search.html", { credentials: "include" })
    .then((response) => response.text())
    .then((html) => {
      // document.documentElement.innerHTML = "";
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

      const mainStyle = document.createElement("link");
      mainStyle.rel = "stylesheet";
      mainStyle.href = "/search/search.css";
      document.head.appendChild(mainStyle);

      // main.html과 관련된 JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "/search/search.js";
      document.body.appendChild(mainScript);

      let login_state = localStorage.getItem("loginState");
      // login_state가 "login"일때 로그아웃 생성
      if (login_state === "login") {
        // 로그인택스트 변경
        const loginText = document.querySelector(".loginText");
        loginText.innerHTML = "로그아웃";
        // 로그아웃 컨테이너 클래스명 변경
        const loginContainer = document.querySelector(".loginContainer");
        loginContainer.classList = "logoutContainer";
      }

      if (searchResults === false) {
        const ol = document.querySelector(".searchInfo-space");
        ol.style.cssText =
          "height: 500px; justify-content: center; flex-direction: column; align-items: center;";
        // justify-content: center;
        const text = document.createElement("h1");
        text.textContent = `${search_word}를(을) 찾을 수 없습니다.`;
        ol.appendChild(text);
        const home_button = document.createElement("button");
        home_button.textContent = "홈으로";
        home_button.classList.add("btn", "btn-warning");
        ol.appendChild(home_button);
      }

      // 검색결과의 length만큼 요소 생성
      for (let i = 0; i <= searchResults.length; i++) {
        information = searchResults[i];

        const ol = document.querySelector(".searchInfo-space");

        const li = document.createElement("li");
        li.classList.add("searchInfo-infoContainer");

        const a = document.createElement("a");
        a.href = "#";

        const infoHead = document.createElement("div");
        infoHead.classList.add("info-header");

        const img = document.createElement("img");
        img.src = information.image;
        img.alt = "";

        const info = document.createElement("div");
        info.classList.add("info");

        const infoTitleContainer = document.createElement("div");
        infoTitleContainer.classList.add("info-title-container");

        const h1 = document.createElement("h1");
        h1.classList.add("info-title");
        h1.textContent = information.title;

        const infoTagContainer = document.createElement("div");
        infoTagContainer.classList.add("info-tag-container");

        const infoTag = document.createElement("p");
        infoTag.textContent = information.menu_type;

        const rate = document.createElement("div");
        rate.classList.add("rate");

        const score = document.createElement("p");
        score.classList.add("score");
        score.textContent = "0점";

        const span1 = document.createElement("span");
        span1.textContent = "|";

        const faStar = document.createElement("p");
        faStar.classList.add("fa", "fa-star", "checked");

        const userScore = document.createElement("p");
        userScore.classList.add("user-score");
        userScore.textContent = information.total_points;

        const span2 = document.createElement("span");
        span2.textContent = "|";

        const comment = document.createElement("p");
        comment.classList.add("comment");
        comment.textContent = `${information.total_votes}명`;

        const reviewContainer = document.createElement("div");
        reviewContainer.classList.add("review-container");

        const reviewSpan = document.createElement("span");
        reviewSpan.classList.add("review");
        reviewSpan.textContent =
          "정말 맛있어요 ~ 정말 맛있어요 ~ 정말 맛있어요 ~ 정말 맛있어요 ~ 정말 맛있어요 ~ ...";

        const locationContainer = document.createElement("div");
        locationContainer.classList.add("location-container");

        const location = document.createElement("p");
        location.classList.add("location");
        location.textContent = information.address;

        const idNumber = information.id;
        const id = document.createElement("p");
        id.textContent = idNumber;
        id.classList.add("id");
        infoHead.appendChild(id);

        ol.appendChild(li);
        li.appendChild(a);
        a.appendChild(infoHead);
        infoHead.appendChild(img);
        infoHead.appendChild(info);
        info.appendChild(infoTitleContainer);
        infoTitleContainer.appendChild(h1);
        info.appendChild(infoTagContainer);
        infoTagContainer.appendChild(infoTag);
        info.appendChild(rate);
        rate.appendChild(score);
        rate.appendChild(span1);
        rate.appendChild(faStar);
        rate.appendChild(userScore);
        rate.appendChild(span2);
        rate.appendChild(comment);
        info.appendChild(reviewContainer);
        reviewContainer.appendChild(reviewSpan);
        a.appendChild(locationContainer);
        locationContainer.appendChild(location);
      }
    });
});

// 검색어 필터
function filterArrayByWord(originalArray, word) {
  const filteredArray = [];

  for (let i = 0; i < originalArray.length; i++) {
    const item = originalArray[i];
    // includes로 null값을 찾으려할때 오류가 발생하기때문에
    // null값을 처리하는 조건문도 작성

    if (
      (item.title && item.title.includes(word)) ||
      (item.menu_type && item.menu_type.includes(word))
    ) {
      filteredArray.push(item);
    }
  }
  if (filteredArray.length === 0) {
    return false;
  }
  return filteredArray;
}



// 자유게시판 연결
const board = document.querySelector('.board');
board.addEventListener('click', () => {

  // 상태 확인 후 게시판으로 넘어갈 때 로그인이 되어 있으면 게시글 작성 버튼이 보이게, 아니면 안 보이게
  // 하기 위해 /api/status로 먼저 통신한 후 list.html에 접근
  fetch("http://127.0.0.1:8080/api/status", { credentials: "include" }) // 로그인 여부 확인 요청에도 쿠키를 포함
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      const isLoggedIn = data.message === 'User is logged in';

      // list.html로 이동
      fetch("/community/list.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
        .then((response) => response.text())
        .then((html) => {
          while (document.documentElement.firstChild) {
            document.documentElement.removeChild(document.documentElement.firstChild);
          }

          const search_html = document.querySelector('html');
          const head = document.createElement('head');
          const body = document.createElement('body');
          search_html.appendChild(head);
          search_html.appendChild(body);

          const range = document.createRange();
          const parsedHTML = range.createContextualFragment(html);
          document.body.appendChild(parsedHTML);
          
          // list.html"과 관련된 CSS 파일 추가
          const mainStyle = document.createElement("link");
          mainStyle.type = "text/css"
          mainStyle.rel = "stylesheet";
          mainStyle.href = "/community/css/list.css";
          document.head.appendChild(mainStyle);

          // list.html"과 관련된 JavaScript 파일 추가
          const mainScript = document.createElement("script");
          mainScript.src = "/community/js/list.js";
          document.body.appendChild(mainScript);

          let login_state = localStorage.getItem('loginState');
          // login_state가 "login"일때 로그아웃 생성
          if (login_state === "login") {
            // 로그인택스트 변경 
            const loginText = document.querySelector(".loginText");
            loginText.innerHTML = "로그아웃";
            // 로그아웃 컨테이너 클래스명 변경
            const loginContainer = document.querySelector(".loginContainer");
            loginContainer.classList = "logoutContainer";
          }

          // list.html에 있는 작성 버튼 선택 및 표시 여부 설정
          const writeButton = document.querySelector('.post-redirect');
          writeButton.style.display = isLoggedIn ? 'block' : 'none';
          })
          .catch((error) => {
            console.error("에러:", error);
          });
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  });
  
  
  // 로그인 연결
  const clickLogin = document.querySelector('.loginText');
  clickLogin.addEventListener('click', () => {
    fetch("/signin/login.html", { credentials: "include" })
    .then((response) => response.text())
    .then((html) => {
      while (document.documentElement.firstChild) {
        document.documentElement.removeChild(document.documentElement.firstChild);
      }
  
      const search_html = document.querySelector('html');
      const head = document.createElement('head');
      const body = document.createElement('body');
      search_html.appendChild(head);
      search_html.appendChild(body);
  
      const range = document.createRange();
      const parsedHTML = range.createContextualFragment(html);
      document.body.appendChild(parsedHTML);
  
      
      const mainStyle = document.createElement("link");
      mainStyle.type = "text/css"
      mainStyle.rel = "stylesheet";
      mainStyle.href = "/signin/css/login.css";
      document.head.appendChild(mainStyle);
  
      // main.html과 관련된 JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "/signin/javascript/login.js";
      document.body.appendChild(mainScript);
      
      
    })
  });
  
  // 현지학기제 연결
  const introduce = document.querySelector('.introduce');
  introduce.addEventListener('click', () => {
    fetch("/introducepage/introduce.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
        while (document.documentElement.firstChild) {
          document.documentElement.removeChild(document.documentElement.firstChild);
        }
    
        const search_html = document.querySelector('html');
        const head = document.createElement('head');
        const body = document.createElement('body');
        search_html.appendChild(head);
        search_html.appendChild(body);
  
        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);
    
        
        // introduce.html과 관련된 CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/introducepage/introduceC.css";
        document.head.appendChild(mainStyle);
    
        // introduce.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/introducepage/introduceJ.js";
        document.body.appendChild(mainScript);

        let login_state = localStorage.getItem('loginState');
        // login_state가 "login"일때 로그아웃 생성
        if (login_state === "login") {
          // 로그인택스트 변경 
          const loginText = document.querySelector(".loginText");
          loginText.innerHTML = "로그아웃";
          // 로그아웃 컨테이너 클래스명 변경
          const loginContainer = document.querySelector(".loginContainer");
          loginContainer.classList = "logoutContainer";
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  
  })
  
  
  // 조원소개 연결
  const teammate = document.querySelector('.teammate');
  teammate.addEventListener('click', () => {
    fetch("/teammate/teammate.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
        while (document.documentElement.firstChild) {
          document.documentElement.removeChild(document.documentElement.firstChild);
        }
    
        const search_html = document.querySelector('html');
        const head = document.createElement('head');
        const body = document.createElement('body');
        search_html.appendChild(head);
        search_html.appendChild(body);
  
        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);
    
        
        // teammate.html과 관련된 CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/teammate/teammate.css";
        document.head.appendChild(mainStyle);
    
        // teammate.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/teammate/teammate.js";
        document.body.appendChild(mainScript);
        
        let login_state = localStorage.getItem('loginState');
        // login_state가 "login"일때 로그아웃 생성
        if (login_state === "login") {
          // 로그인택스트 변경 
          const loginText = document.querySelector(".loginText");
          loginText.innerHTML = "로그아웃";
          // 로그아웃 컨테이너 클래스명 변경
          const loginContainer = document.querySelector(".loginContainer");
          loginContainer.classList = "logoutContainer";
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  
  })
})();
