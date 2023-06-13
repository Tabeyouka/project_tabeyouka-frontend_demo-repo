  (() => {
  let selectedRating = 0;
  let restaurantData = [];
  let reviewData = {};

  function handleFileUpload() {
    const inputFile = document.getElementById("imageInput");
    const imageFile = inputFile.files[0];

    // 선택한 파일이 있는 경우에만 처리
    if (imageFile) {
      reviewData.image_file = imageFile;
      console.log("이미지 파일이 선택되었습니다:", imageFile);
    }
  }

  

  const mainName = document.querySelector(".mainName");
  const tags = document.querySelector(".tags");
  const address = document.querySelector("#address");
  const infoTags = document.querySelector("#infoTags");
  const mainImg = document.querySelector(".mainImg");

// let testData = {};

  // const test = () => {
  //   fetch(`http://localhost:8080/api/reviews/1`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     // body: JSON.stringify(reviewData),
  //   })
  //     .then((response) => {
  //       console.log("응답 받음:", response);
  //     })
  //     .catch((error) => {
  //       // 오류 처리
  //       console.error("오류 발생:", error);
  //     });
  // };


  

  // // 리뷰 달기
  const reviewCreateBtn = document.querySelector('#comment-btn');
  reviewCreateBtn.addEventListener('click', () => {
    
    fetch(`http://localhost:8080/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        console.log("응답 받음:", response);
      })
      .catch((error) => {
        // 오류 처리
        console.error("오류 발생:", error);
      });

    commentValue.value = "";
  })


  // 리뷰 입력 값을 commentData에 저장
  const commentValue = document.querySelector("#comment-input");
  commentValue.addEventListener("input", () => {
    reviewData.review_text = commentValue.value;
    console.log(reviewData);
  });








  
  let storeNumber = Number(document.hash); // 수정 X
  // 수정 X
  // 가게 정보 불러오기
  const restaurantDataLoad = (id) => {
    
    fetch(`http://localhost:8080/api/restaurants/${id}}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("데이터를 가져오는데 실패했습니다.");
        }
      })
      .then((data) => {
        console.log("응답 받음:", data);
        restaurantData = data;
        reviewData.restaurant_id = restaurantData.restaurant.id;
        
        //가게정보 입력
        mainName.textContent = restaurantData.restaurant.title;
        tags.textContent = "# " + restaurantData.restaurant.menu_type;
        infoTags.textContent = restaurantData.restaurant.menu_type;
        address.textContent = restaurantData.restaurant.address;
        mainImg.src = restaurantData.restaurant.image;
      })
      .catch((error) => {
        console.error("오류 발생:", error);
      });
  };
  restaurantDataLoad(storeNumber);

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

  // 수정 X
  //별점click  
  const ratingStars = document.querySelectorAll('.rating__star');

  // 각 요소에 이벤트 추가
  ratingStars.forEach((star, index) => {
    star.addEventListener('click', () => {
      // 클릭될때마다 모든별들을 돌면서 조건 확인
      ratingStars.forEach((star, i) => {
        // 클릭된 별의 index가 같거나 크면 그 스타들 전부 채움
        if (i <= index) {
          star.className = 'rating__star fas fa-star';
        }
        // 아니면 초기화
        else {
          star.className = 'rating__star far fa-star';
        }
      });
    });
  });

// 자유게시판 연결
const board = document.querySelector('.board');
board.addEventListener('click', () => {
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
  
      
      const mainStyle = document.createElement("link");
      mainStyle.type = "text/css"
      mainStyle.rel = "stylesheet";
      mainStyle.href = "/community/css/list.css";
      document.head.appendChild(mainStyle);
  
      // main.html과 관련된 JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "/community/js/list.js";
      document.body.appendChild(mainScript);
    })
    .catch((error) => {
      console.error("에러:", error);
    });

})


// 로그인 연결
const clickLogin = document.querySelector('.loginText');
clickLogin.addEventListener('click', () => {
  // 로그인 성공 시 SPA로 main 페이지 요소들을 보여줌
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
  
      
      const mainStyle = document.createElement("link");
      mainStyle.type = "text/css"
      mainStyle.rel = "stylesheet";
      mainStyle.href = "/introducepage/introduceC.css";
      document.head.appendChild(mainStyle);
  
      // main.html과 관련된 JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "/introducepage/introduceJ.js";
      document.body.appendChild(mainScript);
    })
    .catch((error) => {
      console.error("에러:", error);
    });

})

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
    }

    // 검색결과의 length만큼 요소 생성
    for (let i = 0; i <= searchResults.length; i++ ) {
      information = searchResults[i];
      
      const ol = document.querySelector('.searchInfo-space');
      
      const li = document.createElement('li');
      li.classList.add('searchInfo-infoContainer');
      
      const a = document.createElement('a');
      a.href = '#';
      
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
  
      
      const mainStyle = document.createElement("link");
      mainStyle.type = "text/css"
      mainStyle.rel = "stylesheet";
      mainStyle.href = "/teammate/teammate.css";
      document.head.appendChild(mainStyle);
  
      // main.html과 관련된 JavaScript 파일 추가
      const mainScript = document.createElement("script");
      mainScript.src = "/teammate/teammate.js";
      document.body.appendChild(mainScript);
    })
    .catch((error) => {
      console.error("에러:", error);
    });

})
})();