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

// 조원 생성하는 클래스
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
                deleteTeammate(targetId);
                alert('삭제되었습니다!');
            }
        });
        // eventLister for editBtn
        const editButton = document.querySelectorAll('.editBtn');
        editButton[index].addEventListener('click', (event) => {
            const targetId = event.target.id;
            getMateById(targetId)
            .then(result => {
                let arr = Object.values(result);
                setEditPlaceholder(arr, targetId);
            })
            .catch(error => {
                console.error(error);
            });
            const editModal = document.querySelector('.editModal');
            openModal(editModal, 'editOpacityQue');
        });
    }

}

// 값을 받아옴
const click = document.querySelector('#click');
document.addEventListener('DOM.teammateRowLoaded', get);
async function get() {
    const response = await fetch("http://localhost:8080/api/teammates", {
        method: 'GET',
    });
    const data = await response.json();
    console.log(data);
    return data;
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

// request
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

deleteTeammate()
.then(result => {
    console.log(result);
})
.catch(error => {
    console.error(error);
})

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

// 조원 추가 모달 열고 닫기
const modal = document.querySelector('.modal');
const openModal= (target, className) => {
    target.style.display = 'block';
    setTimeout(()=>{
        target.classList.add(className);
    },100);
}
const closeModal = (target, className) => {
    target.classList.remove(className);
    setTimeout(()=>{
        target.style.display = 'none';
    },800);
}

const modalclosebutton = document.querySelector('#closeModal');
modalclosebutton.addEventListener('click',()=>{closeModal(modal,'opacityQue')});

// 아이디로 조원 정보 검색 GET
async function getMateById(id) {
    const response = await fetch(`http://localhost:8080/api/teammates/${id}`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}
const editModal = document.querySelector('.editModal');
const setEditPlaceholder = (arr) => {
    const editModalInput = editModal.querySelectorAll('input');
    console.log(arr);
    for (let i = 0; i < editModalInput.length; i++) {
        editModalInput[i].setAttribute('value' , arr[i+1]);
    }
};

// 수정 정보 입력
async function editPut() {
    const editModal = document.querySelector('.editModal');
    const input = editModal.querySelectorAll('input');
    const requestBody = {
        student_id: input[0],
        name: input[1],
        profile_image: input[2],
        part: input[3],
        description: input[4],
        github_link: input[5],
    }
    const response = await fetch(`http://localhost:8080/api/teammates/5`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    })
    const data = await response.json();
    return data;
}

// 수정 모달 추가 버튼
const editModalSubmitButton = document.querySelector('#editSubmit');
editModalSubmitButton.addEventListener('click',()=> {
    editPut().then(result => {
        console.log(result);    
    }).catch(error => {
        console.error(error);
    })
});
// 수정 모달 닫기
const editModalCloseButton = document.querySelector('#closeEditModal');
editModalCloseButton.addEventListener('click',()=> {
    closeModal(editModal, 'editOpacityQue');
});

const showImage = (event) => {
    let selectedFile = event.target.files[0];
    console.log(selectedFile);
    if(selectedFile) {
        let reader = new FileReader();
        reader.onload = (uploadEvent) => {
            let fileURL = uploadEvent.target.result;
            const imgEle = document.createElement('img');
            imgEle.src = fileURL;
            const editModalForm = document.querySelector('#editModalForm');
            editModalForm.appendChild(imgEle);
        };
    
    }
};

const imageUploader = document.querySelector('#addProfileImage');
imageUploader.addEventListener('change', showImage);




