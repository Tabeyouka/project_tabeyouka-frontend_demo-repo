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
const phoneNumber = document.querySelectorAll('.callNumber');

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
      storeSubtitle[i].innerText = title;
      storeAddress[i].innerText = address;
      tags[i].innerText = menu_type;
      storePoint[i].innerHTML += PointCalculation(total_points);
      storePoint[i].innerHTML += ` ${total_points}`;
      votes[i].innerText = `${total_votes}명`;
      phoneNumber[i].innerText = `${phone_number}`;

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


// // 로그인 성공 시 SPA로 main 페이지 요소들을 보여줌
// const loginButton = document.querySelector('.loginA');

// loginButton.addEventListener('click', () => {
//   console.log('a');
//   fetch('login.html') // 서버에서 main.html 파일을 가져옴
//     .then(response => response.text()) // 가져온 파일의 내용을 텍스트 형태로 변환
//     .then(html => {
//       console.log(html);
//       // main.html을 삽입할 login.html 요소를 선택 (login.html를 구성하는 body 속 요소 전체를 div 태그로 묶음)
//       const appContainer = document.querySelector('.main-container');
  
//       // 기존 요소 삭제
//       appContainer.remove(); 
//       console.log(appContainer);
//       // main.html 파일에서 가져온 요소들을 삽입
//       appContainer.innerHTML = html;
  
//       // main.html 파일에 포함된 CSS 파일을 가져와서 head 요소에 삽입
//       // "stylesheet"이라는 rel 속성을 가진 모든 link 요소들을 배열로 가져옴
  
//       const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
//       stylesheets.forEach(stylesheet => { // 각 stylesheet 요소를 반복
//       // href 속성 값을 가져옴 (이 값은 스타일시트의 URL)
//       const href = stylesheet.getAttribute('href'); 
//       //  상대 URL을 절대 URL로 변환
//       const fullURL = new URL(href, window.location.href).href;
//       const newStylesheet = document.createElement('link');
//      // 새로운 link 요소를 생성하고, rel 속성을 "stylesheet"으로 설정
//       newStylesheet.rel = 'stylesheet';
//       newStylesheet.href = fullURL;
//     // 새로운 link 요소를 문서의 head에 추가하여 스타일시트가 로드되고 페이지에 적용
//         document.head.appendChild(newStylesheet);
//       });
  
//       // main.html 파일에 포함된 JS 파일을 가져와서 body 요소에 삽입 (방식은 위와 동일)
//       const scripts = Array.from(document.querySelectorAll('script[src]'));
//       scripts.forEach(script => {
//         const src = script.getAttribute('src');
//         const fullURL = new URL(src, window.location.href).href;
//         const newScript = document.createElement('script');
//         newScript.src = fullURL;
//         document.body.appendChild(newScript);
//       });
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
  
// })



// const images = [
//   "https://me-pousse.com/wp-content/uploads/2018/03/kusidajinjya-1024x683.jpg",
//   "https://a3.cdn.japantravel.com/photo/290-216180/1440x960!/fukuoka-fukuoka-prefecture-216180.jpg",
//   "https://www.seabourn.com/content/dam/sbn/inventory-assets/ports/FUA/port-fukuoka-japan-1334x1001.jpg",
// ];
// let index = 0;
// const mainImg = document.querySelector(".mainImg");
// const nextImg = document.querySelector(".nextImg");
// mainImg.style.opacity = "1";
// setInterval(() => {
//   console.dir(nextImg);
//   nextImg.src = images[(index + 1) % images.length];
//   index++;
//   index %= images.length;
//   nextImg.classList.add("show");
//   mainImg.classList.remove("show");
//   setTimeout(() => {
//     mainImg.src = images[index];
//     mainImg.style.opacity = "1";
//     nextImg.classList.remove("show");
//   }, 300);
// }, 4000);