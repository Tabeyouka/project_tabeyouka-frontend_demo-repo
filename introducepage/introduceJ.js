(() => {
  // input 요소 클릭 이벤트
  let input = document.querySelector(".form-control");

  // 클릭 시 주황색 실선 표시
  input.addEventListener("click", function () {
    this.style.borderBottom = "3px solid orange";
  });
  // 클릭해제 시 실선 제거
  input.addEventListener("blur", function () {
    this.style.borderBottom = "none";
  });

  // 로그인 한 유저정보 저장
  let userInfo = {};
  const getUserInfo = () => {
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
      .then((data) => {
        // console.log("응답 받음:", data);
        userInfo = data.user;

        commentData2.nickname = userInfo.nickname;
        commentData2.author_id = userInfo.id;
        editCommentData.nickname = userInfo.nickname;
        editCommentData.author_id = userInfo.id;

        // 댓글 입력창 name을 로그인한 사용자의 nickname으로 변경
        document.querySelector("#commentInputName").textContent =
          userInfo.nickname;
      });
  };

  getUserInfo();

  const modifyBtn = document.querySelector(".modify-btn");

  // 댓글 내용 저장하는 객체
  let noticeData = []; // 본문이 저장
  let noticeData2 = {}; // 수정하는 본문이 입력할 때마다 저장 (input값)

  // 현지학기제 html 생성
  const createText = () => {
    const noticeContent = document.querySelector("#notice-content");

    // 주어진 데이터를 반복하여 댓글 요소를 생성하고 추가
    noticeData.forEach((notice) => {
      const noticeText = document.createElement("div");
      noticeText.className = "notice-body";
      noticeText.innerHTML = notice.article;
      noticeContent.appendChild(noticeText);
    });
  };

  //현지학기제 본문 내용 불러오기
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
        // console.log("응답 받음:", data);
        noticeData = [];
        noticeData = [data];

        createText();
      })

      .catch((error) => {
        console.error("오류 발생:", error);
      });
  };
  noticeLoad();

  // 현지학기제 모달
  const localSemester = document.querySelector("#local-semester");
  const lsModal = document.querySelector(".lsModal");
  localSemester.addEventListener("click", () => {
    lsModal.style.display = "block";
    setTimeout(() => {
      lsModal.classList.add("opacityQue");
    }, 100);
  });

  const closelsModal = document.querySelector("#closelsModal");
  closelsModal.addEventListener("click", () => {
    lsModal.classList.remove("opacityQue");
    setTimeout(() => {
      lsModal.style.display = "none";
    }, 800);
  });

  // 본문 수정

  const modifySection = document.querySelector("#notice-content");
  document.querySelector(".modify-btn").addEventListener("click", () => {
    modifySection.innerHTML = ""; // 본문 내용을 비우기. 안 비우면 중복으로 들어감.

    if (userInfo.nickname != "Tabeyouka") {
      alert("수정 권한이 없습니다.");
    } else {
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
    }
  });

  //수정완료 버튼을 눌렀을 시 수정된 본문을 서버로 보냄
  const modifyCompleted = () => {
    fetch(`http://localhost:8080/api/localsemester`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json ",
      },
      body: JSON.stringify(noticeData2),
    })
      .then((response) => {
        // console.log("응답 받음:", response);
        modifySection.innerHTML = ""; // 본문 내용을 비우기. 안 비우면 중복으로 들어감.
        noticeLoad();
      })
      .catch((error) => {
        console.error("오류 발생:", error);
      });
  };

  // 댓글 내용 저장하는 객체
  let commentData = {}; // 불러온 댓글을 저장
  let commentData2 = {}; // 입력받은 댓글을 저장
  // 입력받은 값을 commentData2에 저장
  const commentValue = document.querySelector("#comment-input");
  commentValue.addEventListener("input", () => {
    // console.log("2", commentData2);
    commentData2.comment_text = commentValue.value;
  });

  // 댓글달기. 등록버튼을 누르면 댓글을 서버로 POST 후 댓글을 다시 불러옴
  const commentCreate = document.querySelector(".comment_create");
  commentCreate.addEventListener("click", () => {
    fetch(`http://localhost:8080/api/localsemestercomments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json ",
      },
      body: JSON.stringify(commentData2),
    })
      .then((response) => {
        // console.log("응답 받음:", response);
        // console.log("작성작성");
        commentLoad();
        commentValue.value = ""; // 댓글 작성 후 input 초기화
      })
      .catch((error) => {
        console.error("오류 발생:", error);
      });
  });

  // // 댓글 html 생성

  const createComments = () => {
    const commentsSection = document.querySelector(".comments");
    commentsSection.innerHTML = "";

    // 주어진 데이터를 반복하여 댓글 요소를 생성하고 추가
    commentData.forEach((comment) => {
      const replyText = document.createElement("div");
      replyText.className = "reply-text01";
      replyText.setAttribute("data-id1", comment.id);
      replyText.setAttribute("data-id2", comment.author_id);

      const replyBody = document.createElement("div");
      replyBody.className = "reply-body";

      const replyName = document.createElement("h4");
      replyName.className = "reply-name";
      replyName.textContent = comment.nickname;

      const replyDel = document.createElement("button");
      replyDel.className = "reply-del";
      replyDel.textContent = "삭제";
      const replyEdit = document.createElement("button");
      replyEdit.className = "reply-edit";
      replyEdit.textContent = "수정";

      const replyContent = document.createElement("p");
      replyContent.className = "reply-content";
      replyContent.textContent = comment.comment_text;

      commentsSection.appendChild(replyText);
      replyText.appendChild(replyBody);
      replyBody.appendChild(replyDel);
      replyBody.appendChild(replyEdit);
      replyBody.appendChild(replyName);
      replyBody.appendChild(replyContent);
    });

    commentEdit();
    commentDel();
  };

  // // 댓글 수정 기능
  let editCommentData = {}; // 수정한 댓글을 저장
  let checkUser = {};
  const commentEdit = () => {
    const editButtons = document.querySelectorAll(".reply-edit");
    const modalBodyText = document.querySelector("#modalBodyText");

    // 각 댓글들의 수정버튼마다 모달창 띄우고, 댓글의 고유 id번호와 고유 author_id를 editCommentData에 저장
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // 댓글의 고유번호 저장하기
        const replyText = e.target.closest(".reply-text01");
        editCommentData.id = replyText.getAttribute("data-id1");
        checkUser.author_id = replyText.getAttribute("data-id2");
        // console.log("editcomment의 이메일", checkUser);
        //모달 창 띄우기
        if (userInfo.id != checkUser.author_id) {
          alert("수정 권한이 없습니다.");
        } else {
          const modal = document.querySelector(".modal");
          modal.style.display = "block";

          // console.log("댓글의 고유 아이디:", editCommentData);
        }
      });
    });

    // 수정 하는 인풋값을 editCommentData에 저장
    modalBodyText.addEventListener("input", () => {
      if (modalBodyText.value === "") {
        document.querySelector("#ErrorMsg").innerHTML =
          "수정할 내용을 입력해주세요.";
      } else {
        document.querySelector("#ErrorMsg").innerHTML = "";
      }
      // console.log(modalBodyText.value);
      editCommentData.comment_text = modalBodyText.value;
      // console.log("수정데이터입니다.", editCommentData);
    });

    // 수정완료 버튼을 누르면 수정된 데이터를 서버로 POST 후 댓글을 다시 불러옴

    document.querySelector("#modalEditBtn").addEventListener("click", () => {
      if (modalBodyText.value === "") {
        document.querySelector("#ErrorMsg").innerHTML =
          "수정할 내용을 입력해주세요.";
        return;
      } else {
        document.querySelector(".modal").style.display = "none";
        document.querySelector("#modalBodyText").value = "";

        fetch(`http://localhost:8080/api/localsemestercomments`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json ",
          },
          body: JSON.stringify(editCommentData),
        })
          .then((response) => {
            // console.log("응답 받음:", response);
            commentLoad();
          })
          .catch((error) => {
            // console.error("오류 발생:", error);
          });
        return;
      }
    });

    // 수정취소 버튼
    document.querySelector("#modalCancelBtn").addEventListener("click", () => {
      document.querySelector(".modal").style.display = "none";
      document.querySelector("#modalBodyText").value = "";
      document.querySelector("#ErrorMsg").innerHTML = "";
    });
  };

  // 댓글 삭제
  let delCommentData = {};

  const commentDel = () => {
    const delButtons = document.querySelectorAll(".reply-del");

    // 각 댓글들의 댓글의 고유 id번호와 고유 author_id를 delCommentData 저장
    delButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // 댓글의 고유번호 저장하기
        const replyText = e.target.closest(".reply-text01");
        delCommentData.id = replyText.getAttribute("data-id1");
        checkUser.author_id = replyText.getAttribute("data-id2");

        // console.log("댓글의 고유 아이디:", delCommentData);

        if (checkUser.author_id != userInfo.id) {
          alert("삭제 권한이 없습니다.");
        } else {
          const confirmation = confirm("정말로 삭제하시겠습니까?");

          if (confirmation) {
            const id = delCommentData.id;
            fetch(`http://localhost:8080/api/localsemestercomments/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json ",
              },
              body: JSON.stringify(delCommentData),
            })
              .then((response) => {
                // console.log("응답 받음:", response);
                commentLoad();
              })
              .catch((error) => {
                console.error("오류 발생:", error);
              });
          } else {
            return;
          }
        }
      });
    });
  };
  //

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
        // console.log("응답 받음:", data);
        commentData = data;
        // console.log(commentData);

        createComments(); // fetch 완료 후 댓글 생성 함수 호출
      })
      .catch((error) => {
        console.error("오류 발생:", error);
      });
  };
  commentLoad();

  // 자유게시판 연결
  const board = document.querySelector(".board");
  board.addEventListener("click", () => {
    fetch("/community/list.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
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
        mainStyle.type = "text/css";
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/community/css/list.css";
        document.head.appendChild(mainStyle);

        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/community/js/list.js";
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

  // 로그인 연결
  const clickLogin = document.querySelector(".loginText");
  clickLogin.addEventListener("click", () => {
    // 로그인 성공 시 SPA로 main 페이지 요소들을 보여줌
    fetch("/signin/login.html", { credentials: "include" })
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
        mainStyle.type = "text/css";
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/signin/css/login.css";
        document.head.appendChild(mainStyle);

        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/signin/javascript/login.js";
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
      });
  });

  async function reviewSearch(id) {
    const response = await fetch(
      `http://localhost:8080/api/restaurants/${id}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  }

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
          reviewSearch(information.id)
            .then((data) => {
              reviewSpan.textContent = data.reviews[0].review_text;
            })
            .catch((error) => {
              // 리뷰가 없으면 리뷰가 없다를 표시
              reviewSpan.textContent = "리뷰가 없습니다.";
            });

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

  // 조원소개 연결
  const teammate = document.querySelector(".teammate");
  teammate.addEventListener("click", () => {
    fetch("/teammate/teammate.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
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
        mainStyle.type = "text/css";
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/teammate/teammate.css";
        document.head.appendChild(mainStyle);

        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/teammate/teammate.js";
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

  const logoutContainer = document.querySelector(".logoutContainer");
  logoutContainer.addEventListener("click", () => {
    // 로그인 상태 변경
    localStorage.setItem("loginState", "logout");
    // 로그인택스트 변경
    const loginText = document.querySelector(".loginText");
    loginText.innerHTML = "로그인";
    // 로그아웃 컨테이너 클래스명 변경
    const loginContainer = document.querySelector(".logoutContainer");
    loginContainer.classList = "loginContainer";
  });
})();
