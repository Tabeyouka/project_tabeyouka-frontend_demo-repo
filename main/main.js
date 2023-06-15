(() => {
// input 요소 클릭 이벤트 
let input = document.querySelector('.form-control');

// 클릭 시 주황색 실선 표시
input.addEventListener('click', function() {
  this.style.borderBottom = '3px solid orange';
});
// 클릭해제 시 실선 제거
input.addEventListener('blur', function() {
  this.style.borderBottom = 'none';
});   



// 이미지 슬라이더
const scrollContainer = document.querySelector('.scroll-container');
const prev = document.querySelector('.fa-square-caret-left');
const next = document.querySelector('.fa-square-caret-right');
const responsive = document.querySelectorAll('.responsive');

let responsiveWidth; // 변수 선언

const updateResponsiveWidth = () => {
	// 첫 번째 responsive 요소의 너비 사용
  responsiveWidth = responsive[0].clientWidth; 
};
// 초기화
updateResponsiveWidth(); 
// 윈도우 크기 변경 시 요소 width 업데이트
window.addEventListener('resize', updateResponsiveWidth);

next.addEventListener('click', () => {
	// 슬라이더 현재위치
  const currentPosition = scrollContainer.scrollLeft;
  // 다음 위치 = 현재위치 + 요소너비
  let nextPosition = currentPosition + responsiveWidth; 
	// 다음위치까지 'smooth'하게 이동
  scrollContainer.scrollTo({
    left: nextPosition,
    behavior: 'smooth'
  });
});

prev.addEventListener('click', () => {
  // 슬라이더 현재위치
  const currentPosition = scrollContainer.scrollLeft;
  // 다음 위치 = 현재위치 - 요소너비
  let prevPosition = currentPosition - responsiveWidth;
	// 다음위치까지 'smooth'하게 이동
  scrollContainer.scrollTo({
    left: prevPosition,
    behavior: 'smooth'
  });
});


// 이미지 슬라이더 v2
const scrollContainer2 = document.querySelector('.scroll-container.v2');
const prev2 = document.querySelector('.fa-square-caret-left.v2');
const next2 = document.querySelector('.fa-square-caret-right.v2');
const responsive2 = document.querySelectorAll('.responsive.v2');

let responsiveWidth2;

const updateResponsiveWidth2 = () => {
  responsiveWidth2 = responsive2[0].clientWidth;
};

updateResponsiveWidth2();

window.addEventListener('resize', updateResponsiveWidth2);

next2.addEventListener('click', () => {
  const currentPosition2 = scrollContainer2.scrollLeft;
  let nextPosition2 = currentPosition2 + responsiveWidth2;
  scrollContainer2.scrollTo({
    left: nextPosition2,
    behavior: 'smooth'
  });
});

prev2.addEventListener('click', () => {
  // 슬라이더 현재위치
  const currentPosition2 = scrollContainer2.scrollLeft;
  // 다음 위치 = 현재위치 - 요소너비
  let prevPosition2 = currentPosition2 - responsiveWidth2;
  scrollContainer2.scrollTo({
    left: prevPosition2,
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

// 0~399 랜덤숫자
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
async function request(id) {
  const response = await fetch(`http://localhost:8080/api/restaurants/${id}`,
  {
    method: 'GET',
  });
  
  const data = await response.json();
  
  return data;
}


// 받아온 정보 사용
const storeTitle = document.querySelectorAll('.title');
const storeSubtitle = document.querySelectorAll('.desc');
const storeAddress = document.querySelectorAll('.location');
const tags = document.querySelectorAll('.tags');
const storePoint = document.querySelectorAll('.star');
const votes = document.querySelectorAll('.commenter');
const sliderImage = document.querySelectorAll('.gallery img');

const imageChange = () => {
  
  // 8개의 랜덤한수 배열 생성
  const randomStore = getRandomArray(storeTitle.length);

  for (let i = 0; i < storeTitle.length; i++ ) {
    // 랜덤함수 이용해서 랜덤한가게 의 객체를 가져와 정보들을 저장
    request(randomStore[i]).then(function(result) {
      
      const title = (result.restaurant.title);
      const address = (result.restaurant.address);
      const menu_type = (result.restaurant.menu_type);
      const total_points = (result.restaurant.total_points);
      const total_votes = (result.restaurant.total_votes);
      const image = (result.restaurant.image);

      const idNumber = (result.restaurant.id);
      const id = document.createElement('p');
      id.textContent = idNumber;
      id.classList.add("id");
      overlays[i].appendChild(id);
      

      storeTitle[i].innerText = title;
      storeSubtitle[i].innerText = title;
      storeAddress[i].innerText = address;
      tags[i].innerText = menu_type;
      storePoint[i].innerHTML += PointCalculation(total_points);
      storePoint[i].innerHTML += ` ${total_points}`;
      votes[i].innerText = `${total_votes}명`;
      sliderImage[i].src = image;
      sliderImage[i].alt = title;
      

      
    }).catch(function(error) {
      console.log('에러',error);
    })
  }
}

imageChange();


let images = document.querySelectorAll(".img-container img");
let current = 0;
// 이미지 변환
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






// 검색시 화면전환

const submit = document.querySelector('#inputForm');
submit.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const search_word = input.value;

  async function requestSearch() {
    const response = await fetch(`http://localhost:8080/api/restaurants`,
    {
      method: 'GET',
    });
    const data = await response.json();

    const search_complete = filterArrayByWord(data, search_word);

    return search_complete;
  }
  const searchResults = await requestSearch();
  
  fetch("/search/search.html", { credentials: "include" })
  .then((response) => response.text())
  .then((html) => {
    
    
    // document.documentElement.innerHTML = "";
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
    mainStyle.href = "/search/search.css";
    document.head.appendChild(mainStyle);

    // main.html과 관련된 JavaScript 파일 추가
    const mainScript = document.createElement("script");
    mainScript.src = "/search/search.js";
    document.body.appendChild(mainScript);

    
    if (searchResults === false) {
        const ol = document.querySelector('.searchInfo-space');
        ol.style.cssText = 'height: 500px; justify-content: center; flex-direction: column; align-items: center;';
        // justify-content: center;
        const text = document.createElement('h1');
        text.textContent = `${search_word}를(을) 찾을 수 없습니다.`
        ol.appendChild(text);
        const home_button = document.createElement('button');
        home_button.textContent = '홈으로';
        home_button.classList.add('btn', 'btn-warning');
        ol.appendChild(home_button);
        home_button.addEventListener('click', () => {
          window.location.href = "";
        }
        );
    }
    
    let login_state = localStorage.getItem('loginState');
    // login_state가 "login"일때 로그아웃 생성
    if (login_state === "login") {
      // 로그인택스트 변경 
      const loginText = document.querySelector(".loginText");
      loginText.innerHTML = "로그아웃";
      // 로그아웃 컨테이너 클래스명 변경
      const loginContainer = document.querySelector(".loginContainer");
      loginContainer.classList = "logoutContainer";
    }
    // 검색결과의 length만큼 요소 생성
    for (let i = 0; i <= searchResults.length; i++ ) {
      information = searchResults[i];
      
      const ol = document.querySelector('.searchInfo-space');
      
      const li = document.createElement('li');
      li.classList.add('searchInfo-infoContainer');
      
      const a = document.createElement('a');
      
      
      const infoHead = document.createElement('div');
      infoHead.classList.add('info-header');
      
      const img = document.createElement('img');
      img.src = information.image;
      img.alt = '';
      

      const info = document.createElement('div');
      info.classList.add('info');
      
      const infoTitleContainer = document.createElement('div');
      infoTitleContainer.classList.add('info-title-container');
      
      const h1 = document.createElement('h1');
      h1.classList.add('info-title');
      h1.textContent = information.title;
      
      const infoTagContainer = document.createElement('div');
      infoTagContainer.classList.add('info-tag-container');
      
      const infoTag = document.createElement('p');
      infoTag.textContent = information.menu_type;
      
      const rate = document.createElement('div');
      rate.classList.add('rate');
      
      const score = document.createElement('p');
      score.classList.add('score');
      score.textContent = '0점';
      
      const span1 = document.createElement('span');
      span1.textContent = '|';
      
      const faStar = document.createElement('p');
      faStar.classList.add('fa', 'fa-star', 'checked');
      
      const userScore = document.createElement('p');
      userScore.classList.add('user-score');
      userScore.textContent = information.total_points;
      
      const span2 = document.createElement('span');
      span2.textContent = '|';
      
      const comment = document.createElement('p');
      comment.classList.add('comment');
      comment.textContent = `${information.total_votes}명`;
      
      const reviewContainer = document.createElement('div');
      reviewContainer.classList.add('review-container');
      
      const reviewSpan = document.createElement('span');
      reviewSpan.classList.add('review');
      reviewSpan.textContent = '정말 맛있어요 ~ 정말 맛있어요 ~ 정말 맛있어요 ~ 정말 맛있어요 ~ 정말 맛있어요 ~ ...';
      
      const locationContainer = document.createElement('div');
      locationContainer.classList.add('location-container');
      
      const location = document.createElement('p');
      location.classList.add('location');
      location.textContent = information.address;

      const idNumber = information.id;
      const id = document.createElement('p');
      id.textContent = idNumber;
      id.classList.add("id");
      infoHead.appendChild(id);
      
  
      ol.appendChild(li);
      li.appendChild(a);
      a.appendChild(infoHead);
      infoHead.appendChild(img);
      infoHead.appendChild(info);
      info.appendChild(infoTitleContainer);
      infoTitleContainer.appendChild(h1);
      info.appendChild(infoTagContainer);
      infoTagContainer.appendChild(infoTag);
      info.appendChild(rate);
      rate.appendChild(score);
      rate.appendChild(span1); 
      rate.appendChild(faStar);
      rate.appendChild(userScore);
      rate.appendChild(span2);
      rate.appendChild(comment);
      info.appendChild(reviewContainer);
      reviewContainer.appendChild(reviewSpan);
      a.appendChild(locationContainer);
      locationContainer.appendChild(location);
      
    };

  });
  
});

// 검색어 필터
function filterArrayByWord(originalArray, word) {
  const filteredArray = [];
  
  for (let i = 0; i < originalArray.length; i++) {
    const item = originalArray[i];
    // includes로 null값을 찾으려할때 오류가 발생하기때문에
    // null값을 처리하는 조건문도 작성
  
    if ((item.title && item.title.includes(word)) || (item.menu_type && item.menu_type.includes(word))) {
      filteredArray.push(item);
    }
  }
  if (filteredArray.length === 0) {
    return false;
  }
  return filteredArray;
}


// 자유게시판 연결
const board = document.querySelector('.board');
board.addEventListener('click', () => {

  // 상태 확인 후 게시판으로 넘어갈 때 로그인이 되어 있으면 게시글 작성 버튼이 보이게, 아니면 안 보이게
  // 하기 위해 /api/status로 먼저 통신한 후 list.html에 접근
  fetch("http://127.0.0.1:8080/api/status", { credentials: "include" }) // 로그인 여부 확인 요청에도 쿠키를 포함
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      const isLoggedIn = data.message === 'User is logged in';

      // list.html로 이동
      fetch("/community/list.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
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
          
          // list.html"과 관련된 CSS 파일 추가
          const mainStyle = document.createElement("link");
          mainStyle.type = "text/css"
          mainStyle.rel = "stylesheet";
          mainStyle.href = "/community/css/list.css";
          document.head.appendChild(mainStyle);

          // list.html"과 관련된 JavaScript 파일 추가
          const mainScript = document.createElement("script");
          mainScript.src = "/community/js/list.js";
          document.body.appendChild(mainScript);

          let login_state = localStorage.getItem('loginState');
          // login_state가 "login"일때 로그아웃 생성
          if (login_state === "login") {
            // 로그인택스트 변경 
            const loginText = document.querySelector(".loginText");
            loginText.innerHTML = "로그아웃";
            // 로그아웃 컨테이너 클래스명 변경
            const loginContainer = document.querySelector(".loginContainer");
            loginContainer.classList = "logoutContainer";
          }

          // list.html에 있는 작성 버튼 선택 및 표시 여부 설정
          const writeButton = document.querySelector('.post-redirect');
          writeButton.style.display = isLoggedIn ? 'block' : 'none';
          })
          .catch((error) => {
            console.error("에러:", error);
          });
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  });
  
  
  // 로그인 연결
  const clickLogin = document.querySelector('.loginText');
  clickLogin.addEventListener('click', () => {
    fetch("/signin/login.html", { credentials: "include" })
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
      mainStyle.type = "text/css"
      mainStyle.rel = "stylesheet";
      mainStyle.href = "/signin/css/login.css";
      document.head.appendChild(mainStyle);
  
      // main.html과 관련된 JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "/signin/javascript/login.js";
      document.body.appendChild(mainScript);
      
      
    })
  });
  
  // 현지학기제 연결
  const introduce = document.querySelector('.introduce');
  introduce.addEventListener('click', () => {
    fetch("/introducepage/introduce.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
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
    
        
        // introduce.html과 관련된 CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/introducepage/introduceC.css";
        document.head.appendChild(mainStyle);
    
        // introduce.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/introducepage/introduceJ.js";
        document.body.appendChild(mainScript);

        let login_state = localStorage.getItem('loginState');
        // login_state가 "login"일때 로그아웃 생성
        if (login_state === "login") {
          // 로그인택스트 변경 
          const loginText = document.querySelector(".loginText");
          loginText.innerHTML = "로그아웃";
          // 로그아웃 컨테이너 클래스명 변경
          const loginContainer = document.querySelector(".loginContainer");
          loginContainer.classList = "logoutContainer";
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  
  })
  
  
  // 조원소개 연결
  const teammate = document.querySelector('.teammate');
  teammate.addEventListener('click', () => {
    fetch("/teammate/teammate.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
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
    
        
        // teammate.html과 관련된 CSS 파일 추가
        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css"
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/teammate/teammate.css";
        document.head.appendChild(mainStyle);
    
        // teammate.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/teammate/teammate.js";
        document.body.appendChild(mainScript);
        
        let login_state = localStorage.getItem('loginState');
        // login_state가 "login"일때 로그아웃 생성
        if (login_state === "login") {
          // 로그인택스트 변경 
          const loginText = document.querySelector(".loginText");
          loginText.innerHTML = "로그아웃";
          // 로그아웃 컨테이너 클래스명 변경
          const loginContainer = document.querySelector(".loginContainer");
          loginContainer.classList = "logoutContainer";
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  
  })
  
  const overlays = document.querySelectorAll('.overlay');
  
  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      const idElement = overlay.querySelector('.id');
      let id = idElement.textContent;
      
      localStorage.setItem('id', id);
      // 가게이동
      fetch("/reviewpage/review.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
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
          mainStyle.type = "text/css"
          mainStyle.rel = "stylesheet";
          mainStyle.href = "/reviewpage/reviewc.css";
          document.head.appendChild(mainStyle);
  
          // review.html과 관련된 CSS 파일 추가
          const mainScript = document.createElement("script");
          mainScript.src = "/reviewpage/reviewj.js";
          document.body.appendChild(mainScript);

          let login_state = localStorage.getItem('loginState');
          // login_state가 "login"일때 로그아웃 생성
          if (login_state === "login") {
            // 로그인택스트 변경 
            const loginText = document.querySelector(".loginText");
            loginText.innerHTML = "로그아웃";
            // 로그아웃 컨테이너 클래스명 변경
            const loginContainer = document.querySelector(".loginContainer");
            loginContainer.classList = "logoutContainer";
          }
          
        })
        .catch((error) => {
          console.error("에러:", error);
        });

  });
  
  });
  
  
  
let login_state = localStorage.getItem('loginState');
// login_state가 "login"일때 로그아웃 생성
if (login_state === "login") {
  // 로그인택스트 변경 
  const loginText = document.querySelector(".loginText");
  loginText.innerHTML = "로그아웃";
  // 로그아웃 컨테이너 클래스명 변경
  const loginContainer = document.querySelector(".loginContainer");
  loginContainer.classList = "logoutContainer";

  const logoutContainer = document.querySelector(".logoutContainer");
  logoutContainer.addEventListener("click", () => {
    // 로그인 상태 변경
    localStorage.setItem('loginState', 'logout');
    // 로그인택스트 변경
    const loginText = document.querySelector(".loginText");
    loginText.innerHTML = "로그인";
    // 로그아웃 컨테이너 클래스명 변경
    const loginContainer = document.querySelector(".logoutContainer");
    loginContainer.classList = "loginContainer";
  });
}

const logoutContainer = document.querySelector(".logoutContainer");
logoutContainer.addEventListener("click", () => {
  // 로그인 상태 변경
  localStorage.setItem('loginState', 'logout');
  // 로그인택스트 변경
  const loginText = document.querySelector(".loginText");
  loginText.innerHTML = "로그인";
  // 로그아웃 컨테이너 클래스명 변경
  const loginContainer = document.querySelector(".logoutContainer");
  loginContainer.classList = "loginContainer";
});

  
})();