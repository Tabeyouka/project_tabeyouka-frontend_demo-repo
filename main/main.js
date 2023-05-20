// input 요소 클릭 이벤트 
const input = document.querySelectorAll('input');

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



const scrollContainer = document.querySelector('.scroll-container');
const prev = document.querySelector('.fa-square-caret-left');
const next = document.querySelector('.fa-square-caret-right');

const width = scrollContainer.clientWidth;
const scrollWidth = scrollContainer.scrollWidth;

prev.addEventListener('click', () => {
  // 현재 scrollLeft 값에서 responsive 크기만큼 왼쪽으로 이동
  scrollContainer.scrollTo({
    left: scrollContainer.scrollLeft - 500,
    behavior: 'smooth'
  });
});

next.addEventListener('click', () => {
  // 현재 scrollLeft 값에서 responsive 크기만큼 오른쪽으로 이동
  scrollContainer.scrollTo({
    left: scrollContainer.scrollLeft + 500,
    behavior: 'smooth'
  });
});
