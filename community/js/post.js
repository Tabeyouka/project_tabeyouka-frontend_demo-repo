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
   
   // formdata에 넣을 요소
   const postForm = document.querySelector("#communityForm");   
   
   // 포스트 작성
   postForm.addEventListener("submit", (event) => {
     event.preventDefault(); // 기본 제출 동작 방지
   
   // author_id, nickname을 얻을 수 있도록 status api를 한 번 거친 후 POST 진행
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
         
         const nickname = statusResult.user.nickname; // 닉네임
         const author_id = statusResult.user.id; // author_id
 
         // /api/status의 응답을 확인
         if (statusResult.message === "User is logged in") {
           // 사용자가 로그인되어 있는 상태
           console.log("사용자가 로그인되어 있습니다.");
   
           // FormData 객체 ;생성(html에 있는 form 요소는 자동으로 추가)
           const formData = new FormData(postForm)
 
           // 이미지 빈값처리(null로 하니까 오류 발생)
           const imageInput = document.getElementById("image");
           const imageFiles = imageInput.files;
 
           if (imageFiles.length === 1) {
             formData.append("image", imageFiles[0]);
           } else {
             formData.append("image", ""); // 사진을 선택하지 않은 경우 빈값
           }
           
           // 닉네임, author_id 추가
           formData.append("nickname", nickname);
           formData.append("author_id", author_id);
 
           
           // 서버로 데이터 전송
           fetch("http://127.0.0.1:8080/api/community", {
             method: "POST",
             body: formData,
             credentials: "include",
           })
             .then((response) => response.json())
             .then((data) => {
               console.log("게시글 작성 성공:", data);
   
               // 바로 삭제 가능하도록 postId 값을 로컬 스토리지에 저장
               const post_id = data.post_id;
               localStorage.setItem("postId", post_id);
               // 글 작성이 완료되면 자기가 작성한 글 보는 페이지로 넘어감
               fetch(`http://127.0.0.1:8080/api/community/${post_id}`, {
                 headers: {
                   "Content-Type": "application/json",
                 },
                 method: "GET",
                 credentials: "include",
               })
                 .then((response) => response.json())
                 .then((post) => {
                   // 게시물 디테일 페이지를 가져오고 화면을 변경
                   fetch("../community/detail.html", {
                     credentials: "include",
                   }) // 쿠키를 포함
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
                          const loginContainer = document.querySelector(".loginContainer");
                          loginContainer.classList = "logoutContainer";
                        }
                     })
                     .catch((error) => {
                       console.error("에러:", error);
                     });
                 });
             })
             .catch((error) => {
               console.error("게시글 작성 실패:", error);
             });
         } else if (statusResult.message === "User is logged out ") {
           // 사용자가 로그인되어 있지 않은 상태
           console.log("사용자가 로그인되어 있지 않습니다.");
         }
       })
       .catch((error) => {
         console.log("api/status 통신 실패", error);
       });
   });
   

   // 목록 버튼 누르면 게시글 리스트 페이지로 이동
   const listRedirect = document.querySelector(".list-btn");
   listRedirect.addEventListener("click", () => {
     fetch("../community/list.html", { credentials: "include" })
       .then((response) => response.text())
       .then((html) => {
         // 해당 html 내용 제거 후 변경할 html로 내용 변경
         while (document.documentElement.firstChild) {
          document.documentElement.removeChild(document.documentElement.firstChild);
        }

         // 해당 html 내용 제거 후 변경할 html로 내용 변경
        const search_html = document.querySelector('html');
        const head = document.createElement('head');
        const body = document.createElement('body');
        search_html.appendChild(head);
        search_html.appendChild(body);
  
        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);
     
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
  
  // 자유게시판 연결
  const board = document.querySelector('.board');
  board.addEventListener('click', () => {
    fetch("/community/list.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
         // 해당 html 내용 제거 후 변경할 html로 내용 변경
         while (document.documentElement.firstChild) {
          document.documentElement.removeChild(document.documentElement.firstChild);
        }

         // 해당 html 내용 제거 후 변경할 html로 내용 변경
        const search_html = document.querySelector('html');
        const head = document.createElement('head');
        const body = document.createElement('body');
        search_html.appendChild(head);
        search_html.appendChild(body);
  
        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);
    
        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/community/css/list.css";
        document.head.appendChild(mainStyle);
    
        // JavaScript 파일 추가
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
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  
  })
  
  
  // 로그인 연결
  const clickLogin = document.querySelector('.loginText');
  clickLogin.addEventListener('click', () => {
    // 로그인 성공 시 SPA로 main 페이지 요소들을 보여줌
    fetch("/signin/login.html", { credentials: "include" })
    .then((response) => response.text())
    .then((html) => {
      // login.html 내용 제거 및 main.html 내용 추가
      while (document.documentElement.firstChild) {
        document.documentElement.removeChild(document.documentElement.firstChild);
      }

       // 해당 html 내용 제거 후 변경할 html로 내용 변경
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

         // 해당 html 내용 제거 후 변경할 html로 내용 변경
        const search_html = document.querySelector('html');
        const head = document.createElement('head');
        const body = document.createElement('body');
        search_html.appendChild(head);
        search_html.appendChild(body);
  
        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);
    
        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/introducepage/introduceC.css";
        document.head.appendChild(mainStyle);
    
        // JavaScript 파일 추가
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
    
        // CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/teammate/teammate.css";
        document.head.appendChild(mainStyle);
    
        // JavaScript 파일 추가
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

  async function reviewSearch(id) {
    const response = await fetch(`http://localhost:8080/api/restaurants/${id}`,
    {
      method: 'GET',
    });
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

        //  JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/search/search.js";
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
          .then(data => {
            reviewSpan.textContent = data.reviews[0].review_text;
          })
          .catch(error => {
            // 리뷰가 없으면 리뷰가 없다를 표시
            reviewSpan.textContent = "리뷰가 없습니다.";
          });

          const locationContainer = document.createElement("div");
          locationContainer.classList.add("location-container");

          const location = document.createElement("p");
          location.classList.add("location");
          location.textContent = information.address;

          const idNumber = information.id;
          const id = document.createElement('p');
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

const logoutContainer = document.querySelector(".logoutContainer");
logoutContainer.addEventListener("click", () => {
// 로그인 상태 변경
localStorage.setItem('loginState', 'logout');
// 로그인택스트 변경
const loginText = document.querySelector(".loginText");
loginText.innerHTML = "로그인";
// 로그아웃 컨테이너 클래스명 변경
const loginContainer = document.querySelector(".logoutContainer");
loginContainer.classList = "loginContainer";
});
  })();