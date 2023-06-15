
const postForm = document.querySelector("#communityForm");
const listRedirect = document.querySelector(".list-btn");
const title = document.querySelector("#title");
const text = document.querySelector("#text");

/* 로컬 스토리지 */
var postId = localStorage.getItem("postId");

// 서버에서 해당 게시글 정보를 가져와서 폼에 값을 채움
fetch(`http://localhost:8080/api/community/${postId}`, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((data) => {
    title.value = data.post.title;
    text.value = data.post.text;
  })
  .catch((err) => console.log("오류가 발생했습니다:", err));

/* 폼에 게시글 내용을 넣음 가져옴 */
fetch("http://localhost:8080/api/community", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((data) => {
    data.posts.forEach((post) => {
      if (post.id === postId) {
        fetch(`http://localhost:8080/api/community/${postId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((data) => {
            title.textContent = data.post.title;
            text.textContent = data.post.text;
          })
          .catch((err) => console.log("오류가 발생했습니다:", err));
      }
    });
  })
  .catch((err) => console.log("오류가 발생했습니다:", err));

// 목록 버튼 누르면 게시글 리스트 페이지로 이동
listRedirect.addEventListener("click", () => {
  fetch("../community/list.html", { credentials: "include" })
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
      mainStyle.rel = "stylesheet";
      mainStyle.href = "../community/css/list.css";
      document.head.appendChild(mainStyle);
  
      // main.html과 관련된 JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "../community/js/list.js";
      document.body.appendChild(mainScript);
    })
    .catch((error) => {
      console.error("에러:", error);
    });
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 기본 제출 동작 방지

  let checkModify = confirm("게시글을 수정하시겠습니까?");

  if (checkModify) {
    fetch(`http://localhost:8080/api/community/${postId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const formData = new FormData(postForm);
        const nickname = data.post.nickname;
        const author_id = data.post.author_id;
        // 이미지 파일을 formData에 추가 (사진을 선택하지 않았을 경우 빈 배열 추가)
        const imageInput = document.getElementById("image");
        const imageFiles = imageInput.files;
        // 이미지 파일 append
        if (imageFiles.length === 1) {
          imageFiles[1];
        } else {
          formData.append("image", ""); // 사진을 선택하지 않은 경우 빈값
        }

        formData.append("nickname", nickname);
        formData.append("author_id", author_id);

        // formdata는 post밖에 안 되므로 하기 조치
        formData.append("_method", "PUT");
        // 서버로 데이터 전송
        fetch(`http://localhost:8080/api/community/${postId}`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("게시글 수정 성공:", data);
            alert("게시글이 수정되었습니다.");

            // 수정 후 상세 페이지로 이동
            fetch(`http://127.0.0.1:8080/api/community/${postId}`, {
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
                   }) // 메인 페이지 요청에도 쿠키를 포함
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
                 });
          })
          .catch((error) => {
            console.error("게시글 수정 실패:", error);
            alert("게시글 수정에 실패했습니다.");
          });
      })
      .catch((err) => console.log("오류가 발생했습니다:", err));
  }
});
