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

// 값을 받아옴
document.addEventListener('DOM.teammateRowLoaded', get);
async function get() {
    const response = await fetch("http://localhost:8080/api/teammates", {
        method: 'GET',
    });
    const data = await response.json();
    console.log(data);
    return data;
}

// 조원 생성하는 클래스
const setEditPlaceholder = (arr) => {
    console.log(arr);
    const editModal = document.querySelector('.editModal');
    const inputs = editModal.querySelectorAll('input[type="text"]');
    const addPreview = editModal.querySelector('img');
    console.log(inputs);
    for (let i = 0; i <= inputs.length; i++) {
        if(i == 0) {
            addPreview.src = arr[i];
        } else {
            inputs[i-1].setAttribute('value' , arr[i]);
        }
    }
};

// 조원 추가 모달 열고 닫기
const modal = document.querySelector('.modal');
const openModal= (target, className) => {
    target.style.display = 'block';
    setTimeout(()=>{
        target.classList.add(className);
    },100);
};
const closeModal = (target, className) => {
    target.classList.remove(className);
    setTimeout(()=>{
        target.style.display = 'none';
    },800);
};
class Mate {
    constructor(id,stdId,name,image,part,des,git) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.stdId = stdId;
        this.part = part;
        this.des = des;
        this.git = git;
    }

    create() {
        const teammateRow = document.querySelector('.teammateRow');
        const createDivAndSet = (tag, att) => {
            const element = document.createElement(tag);
            if(tag == 'div') {
                element.setAttribute('class', att);
            } else if(tag == 'img') {
                element.setAttribute('alt', att);
                element.setAttribute('class', att);
            } else if(tag == 'a') {
                element.setAttribute('class', att);
            } else if(tag == 'button') {
                element.setAttribute('class',att);
                element.setAttribute('id', this.id);
            }
            return element;
        }
        
        // teammate 생성
        const teammate = createDivAndSet('div', 'teammate');
        // profileImage img tag
        const profileImg = createDivAndSet('img', 'imgLink');
        // profileImage 요소 생성 
        const profileImage = createDivAndSet('div','profileImage');
        // studentName
        const studentName = createDivAndSet('div','studentName');
        // part
        const part = createDivAndSet('div','part');
        // description
        const description = createDivAndSet('div','description');
        // github img tag
        const githubImg = createDivAndSet('img', 'github');
        // github a tag
        const githubA = createDivAndSet('a', 'githubA');
        // githublink
        const githubLink = createDivAndSet('div','githubLink');
        // deleteButton
        const buttonDiv = createDivAndSet('div','btnDiv');
        const deleteButton = createDivAndSet('button','deleteBtn');
        // editButton
        const editButton = createDivAndSet('button', 'editBtn');
        
        // member 요소 생성
        deleteButton.innerText = 'X';
        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);
        teammate.appendChild(buttonDiv);
        profileImg.setAttribute('src', this.image);
        profileImage.appendChild(profileImg);
        teammate.appendChild(profileImage);
        studentName.innerText = this.name;
        teammate.appendChild(studentName);
        part.innerText = this.part;
        teammate.appendChild(part);
        description.innerText = this.des;
        teammate.appendChild(description);
        githubImg.setAttribute('src', '/image/githublogo.png');
        githubA.appendChild(githubImg);
        githubA.setAttribute('href', this.git);
        githubLink.appendChild(githubA);
        teammate.appendChild(githubLink);
        teammateRow.appendChild(teammate);
    } 

    setEventListener(index) {
        // eventListener for deleteBtn
        const deleteButton = document.querySelectorAll('.deleteBtn');
        deleteButton[index].addEventListener('click', (event)=> {
            if(confirm('없애고 싶은 조원이 있나요?')) {
                const targetId = event.target.id;
                deleteTeammate(targetId)
                .then(result => {
                    console.log(result);
                    alert('삭제되었습니다!');
                    location.reload();
                })
                .catch(error => {
                    console.error(error);
                });
            }
        });
        // eventLister for editBtn
        const editButton = document.querySelectorAll('.editBtn');
        editButton[index].addEventListener('click', (event) => {
            const targetId = event.target.id;
            getMateById(targetId)
            .then(result => {
                const data = Object.values(result);
                data.shift();
                setEditPlaceholder(data);
                const editSubmit = document.querySelector('#editSubmit');
                editSubmit.value = targetId;
            })
            .catch(error => {
                console.error(error);
            });
            const editModal = document.querySelector('.editModal');
            openModal(editModal, 'editOpacityQue');
        });
    }

}

// 받아온 값을 처리
get()
.then(result => {
    const mateList = [...result];
    save(mateList);
})
.catch(error => {
    console.error(error);
}
)

// 값을 배열 mateList에 저장
const save = (mateList) => {
    for(let i = 0; i < mateList.length; i++) {
        const mate = new Mate(mateList[i].id,
                            mateList[i].student_id, 
                            mateList[i].name, 
                            mateList[i].profile_image, 
                            mateList[i].part, 
                            mateList[i].description,
                            mateList[i].github_link,
        );
        mate.create();
        mate.setEventListener(i);
    }
}

// 특정 조원 삭제
async function deleteTeammate(id) {
 const response = await fetch(`http://localhost:8080/api/teammates/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
       id: 'id', 
    })
 });
 const data = await response.json();
 console.log(data);
 return data;
}

// 조원 추가 버튼(Create)
const addTeammateButton = (text) => {
    // 유효성 검사 구현해야 함
    const button = document.createElement('button');
    button.innerHTML = text;
    button.classList.add('addButton');
    button.addEventListener('click',()=>{openModal(modal,'opacityQue')});
    const team = document.querySelector('.team');
    team.appendChild(button);
}
addTeammateButton('새로운 팀원이 생겼나요?');

async function addTeammate() {
    const addModal = document.querySelector('.modal');
    const input = addModal.querySelectorAll('input');
    const requestBody = {
        student_id: input[0].value,
        name: input[1].value,
        profile_image: input[5].value,
        part: input[2].value,
        description: input[3].value,
        github_link: input[4].value,
    }
    console.log(requestBody);
    const response = await fetch('http://localhost:8080/api/teammates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
}
// 추가 모달 버튼
const addSubmit = document.querySelector('#addSubmit');
addSubmit.addEventListener('click',()=> {
    if(confirm('추가하시겠습니까?')) {
        addTeammate()
        .then(result => {
            console.log(result);
            alert('추가되었습니다!');
            location.reload();
        })
        .catch(error => {
            console.error(error);
        })
    }

});
//
const modalclosebutton = document.querySelector('#closeAddModal');
modalclosebutton.addEventListener('click',()=>{closeModal(modal,'opacityQue')});

// 수정 모달 버튼
const editModalSubmitButton = document.querySelector('#editSubmit');
editModalSubmitButton.addEventListener('click',()=> {
    if(confirm('정말 수정하시겠습니까?')) {
        editPut(editModalSubmitButton.value).then(result => {
            console.log(result);    
        }).catch(error => {
            console.error(error);
        })
    }
});

// 수정 모달 닫기
const editModalCloseButton = document.querySelector('#closeEditModal');
editModalCloseButton.addEventListener('click',()=> {
    const editModal = document.querySelector('.editModal');
    closeModal(editModal, 'editOpacityQue');
});

// 아이디로 조원 정보 검색 GET
async function getMateById(id) {
    const response = await fetch(`http://localhost:8080/api/teammates/${id}`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}

// 수정 요청 보내기
async function editPut(id) {
    const editModal = document.querySelector('.editModal');
    const input = editModal.querySelectorAll('input');
    const requestBody = {
        student_id: input[0],
        name: input[1],
        profile_image: input[5],
        part: input[2],
        description: input[3],
        github_link: input[4],
    }
    const response = await fetch(`http://localhost:8080/api/teammates/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    })
    const data = await response.json();
    return data;
}

const showImage = (event) => {
    let selectedFile = event.target.files[0];
    console.log(selectedFile);
    if(selectedFile) {
        let reader = new FileReader();

        reader.onload = function(event) {
            var fileDataUrl = event.target.result;

            var previewImage = document.getElementById("addPreview");
            previewImage.src = fileDataUrl;
          };

          reader.readAsDataURL(selectedFile);
    }
};
const imageUploader = document.querySelector('#addProfileImage');
imageUploader.addEventListener('change', showImage);




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
})();