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
  
  
  const postForm = document.querySelector("#communityForm");
  const listRedirect = document.querySelector(".list-btn");
  
  postForm.addEventListener("submit", (event) => {
    event.preventDefault(); // 기본 제출 동작 방지
  
    const formData = new FormData(postForm);
  
    // 이미지 파일을 formData에 추가 (사진을 선택하지 않았을 경우 빈 배열 추가)
    const imageInput = document.getElementById("image");
    const imageFiles = imageInput.files;
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("image", imageFiles[i]);
      }
    } else {
      formData.append("image", null); // 사진을 선택하지 않은 경우 빈값
    }
  
  
    // 서버로 데이터 전송
    fetch("http://127.0.0.1:8080/api/community", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("게시글 작성 성공:", data);
        
        // 글 작성이 완료되면 자기가 작성한 글 보는 페이지로 넘어감
        fetch(`http://127.0.0.1:8080/api/community/${data.post_id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        })
          .then((response) => response.json())
          .then((post) => {
            // 게시물 디테일 페이지를 가져오고 화면을 변경
            fetch("../community/detail.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
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
                mainStyle.href = "../community/css/detail.css";
                document.head.appendChild(mainStyle);

                // 메인.html과 관련된 JavaScript 파일 추가
                const mainScript = document.createElement("script");
                mainScript.src = "../community/js/detail.js";
                document.body.appendChild(mainScript);
              })
              .catch((error) => {
                console.error("에러:", error);
              });
          })

      })
      .catch((error) => {
        console.error("게시글 작성 실패:", error);
      });
  });
  
  // 목록 버튼 누르면 게시글 리스트 페이지로 이동
  
  listRedirect.addEventListener("click", () => {
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
  
  // 자유게시판 연결
  const board = document.querySelector('.board');
  board.addEventListener('click', () => {
    fetch("/community/list.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
        // 로그인.html의 내용을 제거하고 메인.html의 내용 추가
        document.documentElement.innerHTML = "";
  
        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);
    
        
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/community/css/list.css";
        document.head.appendChild(mainStyle);
    
        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/community/js/list.js";
        document.body.appendChild(mainScript);
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
      document.documentElement.innerHTML = "";
  
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
    
        
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/introducepage/introduceC.css";
        document.head.appendChild(mainStyle);
    
        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/introducepage/introduceJ.js";
        document.body.appendChild(mainScript);
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
    
        
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/teammate/teammate.css";
        document.head.appendChild(mainStyle);
    
        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/teammate/teammate.js";
        document.body.appendChild(mainScript);
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  
  })
  })();