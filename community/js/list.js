const itemsPerPage = 10; // 페이지당 표시할 글의 개수
let currentPage = 1; // 현재 페이지 번호
let searchKeyword = ''; // 검색 키워드

// 페이지 번호를 업데이트하고 게시글 데이터를 가져오는 함수
function updateBoardData(page) {
  currentPage = page;
  fetchBoardData(page)
    .then(posts => {
      const filteredPosts = searchKeyword ? filterPostsByKeyword(posts) : posts;
      addPostsToBoard(filteredPosts);
    })
    .catch(error => {
      console.error('API 요청 중 오류가 발생했습니다:', error);
    });
}

// 게시글 데이터를 페이지별로 가져오는 함수
function fetchBoardData(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return fetch('http://localhost:8080/api/community', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })
    .then(response => {
      console.log("서버 통신 완료");
      return response.json();
    })
    .then(data => {
      const posts = data.posts.data.slice(start, end);
      return posts;
    })
    .catch(error => console.log(error));
}

// 게시판 데이터를 HTML에 추가하는 함수
function addPostsToBoard(posts) {
  const postListContainer = document.getElementById('post-list');
  postListContainer.innerHTML = ''; // 이전 게시글 목록을 초기화

  // 게시물을 반복하며 HTML 요소 생성
  posts.forEach(post => {
    const postRow = document.createElement('div');
    postRow.className = 'row';

    postRow.innerHTML = `
      <div class="col id">${post.id}</div>
      <div class="col title">${post.title}</div>
      <div class="col">${post.author ? post.author.name : 'Unknown'}</div>
      <div class="col date">${formatDate(post.created_at)}</div>
    `;

    postListContainer.appendChild(postRow);
  });

  // 페이지 넘버 업데이트
  const pageNumber = document.querySelector('.page-number');
  pageNumber.textContent = currentPage;

  // 이전 페이지 버튼 업데이트
  const prevButton = document.querySelector('.pagination.page-prev');
  if (currentPage > 1) {
    prevButton.style.display = 'inline';
  } else {
    prevButton.style.display = 'none';
  }
}

// 페이지 네비게이션의 이벤트 핸들러 설정
const prevButton = document.querySelector('.pagination.page-prev');
const nextButton = document.querySelector('.pagination.page-next');

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    updateBoardData(currentPage - 1);
  }
});

nextButton.addEventListener('click', () => {
  updateBoardData(currentPage + 1);
});

// 초기화 함수
function init() {
  updateBoardData(currentPage);
}

// 초기화 함수 호출
init();

// 날짜 형식을 변환하는 함수
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 검색 버튼 클릭 이벤트 핸들러 설정
const searchButton = document.querySelector('.search-btn');
const searchInput = document.querySelector('#search-input');

searchButton.addEventListener('click', () => {
  searchKeyword = searchInput.value.trim();
  updateBoardData(1);
});

// 제목에 키워드가 포함된 게시글 필터링 함수
function filterPostsByKeyword(posts) {
  return posts.filter(post => post.title.toLowerCase().includes(searchKeyword.toLowerCase()));
}


// post.js 통신

const postRedirect = document.querySelector('.post-redirect');

postRedirect.addEventListener('click', () => {

  fetch('../community/post.html', { credentials: 'include' })
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
    mainScript.src = "../community/js/post.js";
    mainScript.type = "text/javascript"; // MIME 유형 설정
    document.body.appendChild(mainScript);
  })
  .catch((error) => {
    console.error("에러:", error);
  });

})

