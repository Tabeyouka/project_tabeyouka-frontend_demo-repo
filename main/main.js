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
  // 현재 scrollLeft 값에서 460만큼 왼쪽으로 이동
  scrollContainer.scrollTo({
    left: scrollContainer.scrollLeft - 460,
    behavior: 'smooth'
  });
});

next.addEventListener('click', () => {
  // 현재 scrollLeft 값에서 460만큼 오른쪽으로 이동
  scrollContainer.scrollTo({
    left: scrollContainer.scrollLeft + 460,
    behavior: 'smooth'
  });
});


function getRandomArray(num) { 
  // 0부터 399까지의 숫자 배열을 만든 후
  const arr = Array.from(Array(400).keys()); 
  const result = []; 
  // num만큼 반복하면서 무작위 인덱스를 생성한 후 arr에서 값을 추출하여 결과 배열에 추가
  for (let i = 0; i < num; i++) { 
    let randomIndex = Math.floor(Math.random() * arr.length); 
    result.push(arr[randomIndex]); 
    // 이미 추출한 값은 arr에서 제거
    arr.splice(randomIndex, 1); 
  } 
  return result; 
}



async function request(storeNumber) {
  const response = await fetch('http://localhost:8080/api/restaurants',
  {
    method: 'GET',
  });
  const data = await response.json();

  return data[storeNumber];
}

const storeTitle = document.querySelectorAll('.title');
const storeAddress = document.querySelectorAll('.location');
const imageChange = () => {
  // 8개의 랜덤한수 배열 생성
  const randomStore = getRandomArray(storeTitle.length);

  for (let i = 0; i < storeTitle.length; i++ ) {
    // 랜덤함수 이용해서 랜덤한가게 의 객체를 가져와 정보들을 저장
    request(randomStore[i]).then(function(result) {
      const title = (result.title);
      const address = (result.address);
      const menu_type = (result.menu_type);
      const phone_number = (result.phone_number);
      const total_points = (result.total_points);
      const total_votes = (result.total_votes);
      
      storeTitle[i].innerText = title;
      storeAddress[i].innerText = address;

    }).catch(function(error) {
      console.log('에러',error);
    })
  }
}

imageChange();



// 1. a태그로 해당가게 href 추가 (현재 가게정보 페이지가 없기에 추후에 추가)
// 2. a태그 속 img태그 주소를 불러와 변경 (이미지 주소값 추가까지 대기)
// 3. overlay클래스의 가게이름, 주소, 리뷰 innerText 변경
// 4. 받아온 data의 평점을 계산하여 별 이미지 변경, innerText(평점)변경
// 5. 북마커, 댓글 갯수 Text수정