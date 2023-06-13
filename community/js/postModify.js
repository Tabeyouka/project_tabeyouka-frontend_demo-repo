const postForm = document.querySelector("#communityForm"); 
const listRedirect = document.querySelector(".list-btn");
const title = document.querySelector('#title');
const text = document.querySelector('#text');

/* 게시글 아이디 : url에 추가할 예정 */
let postId;

/* 게시글 목록 페이지의 번호와 게시글의 아이디가 같은지 비교*/
fetch("./../list.html")
  .then((response) => response.text())
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 가져온 HTML에서 원하는 요소 선택
    postId = doc.getElementsByClassName("id").value; // 현재 undefined
  })
  .catch((error) => {
    console.error("에러:", error);
  });


/* 게시글의 id를 가져옴 */
fetch("http://localhost:8080/api/community", {
  method: "GET",
  headers: { "Content-Type": "application/json" }
})
.then(res => res.json())
.then(data => {
  data.posts.forEach((post) => {
    if(post.id === postId) {
      fetch(`http://localhost:8080/api/community/${postId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json"}
      })
      .then(res => res.json())
      .then(data => {
        title.textContent = data.post.title;
        text.textContent = data.post.text;
      })
      .catch(err => console.log("오류가 발생했습니다:", err));
    }
  })
})
.catch(err => console.log("오류가 발생했습니다:", err));

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

postForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 기본 제출 동작 방지

  const formData = new FormData(postForm);

  // 이미지 파일을 formData에 추가 (사진을 선택하지 않았을 경우 빈 배열 추가)
  const imageInput = document.getElementById("image");
  const imageFiles = imageInput.files;
  if (imageFiles.length > 0) {
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images", imageFiles[i]);
    }
  } else {
    formData.append("images", null); // 사진을 선택하지 않은 경우 빈 배열 추가
  }

  let checkModify = confirm('게시글을 수정하시겠습니까?');

  if(checkModify){
    // 서버로 데이터 전송
    fetch("http://localhost:8080/api/community/{community}", {
      method: "PUT",
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {  
      console.log("게시글 수정 성공:", data);
      alert('게시글이 수정되었습니다.');
    })
    .catch((error) => {
      console.error("게시글 수정 실패:", error);
      alert('게시글 수정에 실패했습니다.');
    });
  }
});

