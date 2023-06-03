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



const scrollContainer = document.querySelector('.scroll-container');
const prev = document.querySelector('.fa-square-caret-left');
const next = document.querySelector('.fa-square-caret-right');

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


// 평점계산 로직
const PointCalculation = (storePoint) => {
  let stars = '';

  if (storePoint === 5) {
    stars = '<div class="fa fa-star checked"></div>'.repeat(5);
  } else if (storePoint >= 4 && storePoint < 5) {
    stars = '<div class="fa fa-star checked"></div>'.repeat(4) + '<div class="fa fa-star"></div>';
  } else if (storePoint >= 3 && storePoint < 4) {
    stars = '<div class="fa fa-star checked"></div>'.repeat(3) + '<div class="fa fa-star"></div>'.repeat(2);
  } else if (storePoint >= 2 && storePoint < 3) {
    stars = '<div class="fa fa-star checked"></div>'.repeat(2) + '<div class="fa fa-star"></div>'.repeat(3);
  } else if (storePoint >= 0.1 && storePoint < 2) {
    stars = '<div class="fa fa-star checked"></div>' + '<div class="fa fa-star"></div>'.repeat(4);
  } else if (storePoint === 0) {
    stars = '<div class="fa fa-star"></div>'.repeat(5);
  }

  return stars;
}


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




// api로 가게정보 받아오기
async function request(storeNumber) {
  const response = await fetch('http://localhost:8080/api/restaurants',
  {
    method: 'GET',
  });
  const data = await response.json();

  return data[storeNumber];
}


// 받아온 정보 사용
const storeTitle = document.querySelectorAll('.title');
const storeSubtitle = document.querySelectorAll('.desc');
const storeAddress = document.querySelectorAll('.location');
const tags = document.querySelectorAll('.tags');
const storePoint = document.querySelectorAll('.star');
const votes = document.querySelectorAll('.commenter');

const imageChange = () => {
  
  // 8개의 랜덤한수 배열 생성
  const randomStore = getRandomArray(storeTitle.length);

  for (let i = 0; i < storeTitle.length; i++ ) {
    // 랜덤함수 이용해서 랜덤한가게 의 객체를 가져와 정보들을 저장
    request(randomStore[i]).then(function(result) {

      const title = (result.title);
      const address = (result.address);
      const menu_type = (result.menu_type);
      const total_points = (result.total_points);
      const total_votes = (result.total_votes);

      storeTitle[i].innerText = title;
      storeSubtitle[i].innerText = title;
      storeAddress[i].innerText = address;
      tags[i].innerText = menu_type;
      storePoint[i].innerHTML += PointCalculation(total_points);
      storePoint[i].innerHTML += ` ${total_points}`;
      votes[i].innerText = `${total_votes}명`;
      

    }).catch(function(error) {
      console.log('에러',error);
    })
  }
}

imageChange();


let images = document.querySelectorAll(".img-container img");
let current = 0;

setInterval(() => {
  for (let i = 0; i < images.length; i++) {
    images[i].style.opacity = 0;
  }
  // 1번이미지 투명도 1
  images[current].style.opacity = 1;
  // current가 마지막번호일때 0으로 초기화
  current = (current + 1) % images.length;
  // current(순서)가 0일때 투명도 변경시작
  if (current === 0) {
    setTimeout(() => {
      for (let i = 0; i < images.length; i++) {
        images[i].style.opacity = 1;
      }
    }, 1000);
  }

}, 5000);
    