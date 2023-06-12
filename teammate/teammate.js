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




