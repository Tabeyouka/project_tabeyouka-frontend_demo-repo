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

// fetch를 위한 함수
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

/* 게시글 정보를 가져옴 */
/* 예시: 게시글 목록의 첫 번째 */
fetchData("http://localhost:8080/api/community", "GET",
{ "Content-Type": "application/json"})
.then(res => {
  console.log(res);
  title.textContent = res.posts.data[0].title;
  writer.textContent = res.posts.data[0].author_id ? res.posts.data[0].author_id : "이름 없는 사용자";
  date.textContent = formatDate(res.posts.data[0].created_at);
  content.textContent = res.posts.data[0].text;
})
.catch(err => console.log("오류 발생:", err));

/* 게시글 목록 버튼: 누르면 게시글 목록 페이지로 넘어감 */
const listBtn = document.querySelector('.list');
listBtn.addEventListener('click', () => {
  window.location.href = './../community/list.html';
})

/* 게시글 수정 버튼: 누르면 게시글 수정 페이지로 넘어감 */
const modifyBtn = document.querySelector('.modify');
modifyBtn.addEventListener('click', () => {
  window.location.href = './../community/postModify.html';
})

/* 게시글 삭제 버튼: 누르면 게시글 삭제 알림창을 띄운 뒤 확인/취소 여부에 따라 게시글을 삭제함 */
const deleteBtn = document.querySelector('.delete');


deleteBtn.addEventListener('click', () => {
  let question = confirm('정말로 삭제하시겠습니까?');
  if(question) {
    fetchData(`http://localhost:8080/api/community/30`, 'DELETE', 
    { "Content-Type": "application/json"})
    .then(res => {
      console.log(res);
      alert('게시글 삭제에 성공하였습니다.');
    })
    .catch(err => {
      console.log("오류 발생: ", err);
      alert('게시글 삭제에 실패하였습니다.');
    });

    // 삭제된 게시글을 list.html에서 삭제함(로직 추가 예정)
  } 
})

/* 게시글 댓글 정보: 게시글 작성자, 게시글 작성 일자가 들어감 */
const commentInfo = document.querySelector('.comment-info p');
const commentContent = document.querySelector('.comment-content');
fetchData("http://localhost:8080/api/community/1/comments", "GET", 
{"Content-Type": "application/json"})
.then(res => {
  console.log(res);

  commentInfo.textContent = `${res.comments.author_id} ${res.comments.created_at}`;
  commentContent.textContent = `${res.comments.text}`;
})

/* 등록할 댓글 내용 */
const commentInput = document.querySelector('.comment-input');

/* 댓글 등록 버튼 */
const registerBtn = document.querySelector('.com-register-btn');

registerBtn.addEventListener('click', () => {
  fetchData("http://localhost:8080/api/community/1/comments", "POST",
  { "Content-Type": "application/json"}, commentInput.value)
  .then(res => {
    console.log("댓글 등록: ", res);

  })
  .catch(err => {
    console.log("오류 발생: ", err);
    alert('댓글 등록에 실패하였습니다.')
  })
})

const comModifyBtn = document.querySelector('.com-modify-btn');

const comDeleteBtn = document.querySelector('.com-delete-btn');
comDeleteBtn.addEventListener('click', () => {
  let checkDelete = confirm('정말로 댓글을 삭제하시겠습니까?');
  if(checkDelete) {

  }
})
