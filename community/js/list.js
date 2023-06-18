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

  const itemsPerPage = 10; // 페이지당 표시할 글의 개수
  let currentPage = 1; // 현재 페이지 번호
  let searchKeyword = ""; // 검색 키워드
  const postRedirect = document.querySelector(".post-redirect"); // 작성 버튼 선택자

  /** api 통신을 통해 게시글 데이터를 가져오는 함수*/
  function fetchBoardData() {
    return fetch("http://127.0.0.1:8080/api/community", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.posts; // 정렬되지 않은 게시글 데이터 반환
      })
      .catch((error) => console.log(error));
  }

  /**  페이지 번호를 업데이트하고 게시글 데이터를 가져오는 함수(1페이지 당 10개) */
  function updateBoardData(page) {
    currentPage = page;
    fetchBoardData(page)
      .then((posts) => {
        // 필터링한 게시물을 가져오는지, 전체 게시물을 가져오는지
        const filteredPosts = searchKeyword
          ? filterPostsByKeyword(posts)
          : posts;
        // id 내림차순
        const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);
        // 게시글 10개로 분배
        const pagedPosts = sortedPosts.slice(
          (page - 1) * itemsPerPage,
          page * itemsPerPage
        );
        addPostsToBoard(pagedPosts);
      })
      .catch((error) => {
        console.error("API 요청 중 오류가 발생했습니다:", error);
      });
  }

  /**  게시판 데이터를 HTML에 추가하는 함수 */
  function addPostsToBoard(posts) {
    const postListContainer = document.getElementById("post-list");
    postListContainer.innerHTML = ""; // 이전 게시글 목록을 초기화
    let postRow;
    // 게시물을 반복하며 HTML 요소 생성
    posts.forEach((post) => {
      postRow = document.createElement("div");
      postRow.className = "board_row";

      postRow.innerHTML = `
      <div class="col id">${post.id}</div>
      <div class="col title">${post.title}</div>
      <div class="col nickname">${
        post.nickname ? post.nickname : "Unknown"
      }</div>
      <div class="col date">${formatDate(post.created_at)}</div>
    `;

    // 닉네임 확인 위함(게시글 작성자랑 status 유저정보 비교 후 동일하면 수정, 삭제 버튼 노출 여부 결정 위함)
      postRow.addEventListener("click", () => {
        fetch(`http://127.0.0.1:8080/api/community/${post.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        })
          .then((response) => response.json())
          .then((post) => {
            // post.id를 로컬 스토리지에 저장 -> detail에서 로컬 스토리지 값을 읽어와 post.id값을 이용해 API 통신
            const post_id = post.post.id;
            const post_nickname = post.post.nickname;
            localStorage.setItem("postId", post_id);
            // 게시물 디테일 페이지를 가져오고 화면을 변경

            fetch("http://127.0.0.1:8080/api/status", {
              credentials: "include",
            }) // 로그인 여부 확인 요청에도 쿠키를 포함
              .then((response) => response.json())
              .then((data) => {
                if(data.message === 'User is logged in'){
                  var status_nickname = data.user.nickname;
                }
                
                var nicknameCheck;

                if (status_nickname === post_nickname) {
                  nicknameCheck = true;
                } else {
                  nicknameCheck = false;
                }

                // list.html로 이동
                fetch("../community/detail.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
                  .then((response) => response.text())
                  .then((html) => {
                    // html 요소 추가
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

                    // CSS 파일 추가
                    const mainStyle = document.createElement("link");
                    mainStyle.rel = "stylesheet";
                    mainStyle.type = "text/css";
                    mainStyle.href = "../community/css/detail.css";
                    document.head.appendChild(mainStyle);

                    // JavaScript 파일 추가
                    const mainScript = document.createElement("script");
                    mainScript.src = "../community/js/detail.js";
                    document.body.appendChild(mainScript);

                    let login_state = localStorage.getItem("loginState");
                    // login_state가 "login"일때 로그아웃 생성
                    if (login_state === "login") {
                      // 로그인택스트 변경
                      const loginText = document.querySelector(".loginText");
                      loginText.innerHTML = "로그아웃";
                      // 로그아웃 컨테이너 클래스명 변경
                      const loginContainer =
                        document.querySelector(".loginContainer");
                      loginContainer.classList = "logoutContainer";
                    }

                    // 수정, 삭제 버튼
                    const modifyButton = document.querySelector(".post-modify");
                    const deleteButton = document.querySelector(".post-delete");

                    modifyButton.style.display = nicknameCheck
                      ? "block"
                      : "none";
                    deleteButton.style.display = nicknameCheck
                      ? "block"
                      : "none";
                  })
                  .catch((error) => {
                    console.error("에러:", error);
                  });
              })
              .catch((error) => {
                console.error("에러:", error);
              });
          })

          .catch((error) => {
            console.error("API 요청 중 오류가 발생했습니다:", error);
          });
      });

      postListContainer.appendChild(postRow);
    });

    // 페이지 넘버 업데이트
    const prevButton = document.querySelector(".pagination.page-prev");
    const nextButton = document.querySelector(".pagination.page-next");
    const pageNumber = document.querySelector(".page-number");

    pageNumber.textContent = currentPage;

    // 현재 페이지가 1이면 "prev" 버튼을 숨김
    if (currentPage === 1) {
      prevButton.style.display = "none";
    } else {
      prevButton.style.display = "inline";
    }

    // 현재 페이지에 포함된 게시물 개수가 itemsPerPage보다 작으면 "next" 버튼을 숨김
    if (posts.length < itemsPerPage) {
      nextButton.style.display = "none";
    } else {
      nextButton.style.display = "inline";
    }
  }

  // 페이지 네비게이션의 이벤트 핸들러 설정
  const prevButton = document.querySelector(".pagination.page-prev");
  const nextButton = document.querySelector(".pagination.page-next");

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      updateBoardData(currentPage - 1);
    }
  });

  nextButton.addEventListener("click", () => {
    updateBoardData(currentPage + 1);
  });

  /** 초기화 함수 */
  function init() {
    updateBoardData(currentPage);
  }

  // 초기화 함수 호출
  init();

  /**  날짜 형식을 변환하는 함수 */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // 검색 버튼 클릭 이벤트 핸들러 설정
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector("#search-input");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchKeyword = searchInput.value.trim(); // 검색 키워드 양쪽 공백 없앰
    updateBoardData(1);
  });

  /** 제목에 키워드가 포함된 게시글 필터링 함수 */
  function filterPostsByKeyword(posts) {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  // post.js 통신

  postRedirect.addEventListener("click", () => {
    fetch("../community/post.html", { credentials: "include" })
      .then((response) => response.text())
      .then((html) => {
        // 해당 html 내용 제거 후 변경할 html로 내용 변경
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

        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.rel = "stylesheet";
        mainStyle.type = "text/css";
        mainStyle.href = "/community/css/post.css";
        document.head.appendChild(mainStyle);

        // JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/community/js/post.js";
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
        // login.html 내용 제거 및 main.html 내용 추가
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

        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css";
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/signin/css/login.css";
        document.head.appendChild(mainStyle);

        // JavaScript 파일 추가
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

        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/search/search.css";
        document.head.appendChild(mainStyle);

        // JavaScript 파일 추가
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

  // 현지학기제 연결
  const introduce = document.querySelector(".introduce");
  introduce.addEventListener("click", () => {
    fetch("/introducepage/introduce.html", { credentials: "include" }) // 쿠키를 포함
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

        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css";
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/introducepage/introduceC.css";
        document.head.appendChild(mainStyle);

        // JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/introducepage/introduceJ.js";
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

  // 조원소개 연결
  const teammate = document.querySelector(".teammate");
  teammate.addEventListener("click", () => {
    fetch("/teammate/teammate.html", { credentials: "include" }) // 쿠키를 포함
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

        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css";
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/teammate/teammate.css";
        document.head.appendChild(mainStyle);

        // JavaScript 파일 추가
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

  // 자유게시판 연결 (자유게시판에서도 자유게시판 누를 수 있도록)
  // 자유게시판 연결
const board = document.querySelector('.board');
board.addEventListener('click', () => {

  // 상태 확인 후 게시판으로 넘어갈 때 로그인이 되어 있으면 게시글 작성 버튼이 보이게, 아니면 안 보이게
  // 하기 위해 /api/status로 먼저 통신한 후 list.html에 접근
  fetch("http://127.0.0.1:8080/api/status", { credentials: "include" }) // 로그인 여부 확인 요청에도 쿠키를 포함
    .then((response) => response.json())
    .then((data) => {
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
