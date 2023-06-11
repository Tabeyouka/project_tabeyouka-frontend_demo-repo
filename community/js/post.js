const postForm = document.querySelector('#communityForm');
const listRedirect = document.querySelector('.list-btn');

postForm.addEventListener('submit', (event) => {
  event.preventDefault(); // 기본 제출 동작 방지

  const formData = new FormData(postForm);

  // 이미지 파일을 formData에 추가 (사진을 선택하지 않았을 경우 빈 배열 추가)
  const imageInput = document.getElementById('image');
  const imageFiles = imageInput.files;
  if (imageFiles.length > 0) {
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }
  } else {
    formData.append('images', null); // 사진을 선택하지 않은 경우 빈 배열 추가
  }

  // 서버로 데이터 전송
  fetch('http://localhost:8080/api/community', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log('게시글 작성 성공:', data);
      // !!!!!!!!!!!!!!자신이 작성한 글 페이지로 이동하게 fetch 처리 필요!!!!!!!!!!!!
    })
    .catch(error => {
      console.error('게시글 작성 실패:', error);
    });
});


// 목록 버튼 누르면 게시글 리스트 페이지로 이동

listRedirect.addEventListener('click', () => {

  fetch('../community/list.html', { credentials: 'include' })
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

})
