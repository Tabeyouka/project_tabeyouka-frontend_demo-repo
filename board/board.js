// input 요소 클릭 이벤트 
const input = document.querySelectorAll('.form-control');

input.forEach(function(element) {
    // 클릭 시 주황색 실선 표시
    element.addEventListener('click', function() {
        this.style.borderBottom = '3px solid orange';
    });
    // 클릭해제 시 실선 제거
    // 나중에 얘기해봐야할 듯
    element.addEventListener('blur', function() {
        this.style.borderBottom = '1px solid gray';
    });
});

const title = document.querySelector('.title');
const commentsCount = document.querySelector('.comments-count');
const writer = document.querySelector('.writer');
const date = document.querySelector('.date');

const listBtn = document.querySelector('.list');
const modifyBtn = document.querySelector('.modify');
const deleteBtn = document.querySelector('.delete');

fetch("api/community", {
    'method': 'GET',
    'headers': {
        'Content-Type': "application/json"
    }
})
.then(response => response.text())
.then(result => {
    const test = document.querySelector('.test');
    test.textContent = result;
})
.catch(error => {
    console.log('데이터 전송 실패: ', error);
});





const commentInfo = document.querySelector('.comment-info');
const commentContent = document.querySelector('comment-content');

const registerBtn = document.querySelector('.register-btn');







