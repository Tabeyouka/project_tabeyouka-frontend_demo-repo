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

    // 조원 생성하는 클래스 (개선 필요)
    class Mate {
        constructor(id, stdId, name, image, part, des, git) {
            this.id = id;
            this.image = image;
            this.name = name;
            this.stdId = stdId;
            this.part = part;
            this.des = des;
            this.git = git;
        }
        // html에 요소를 추가하고 속성을 정의하는 함수, saveAndCreate() 에서 반복됨
        create() {
            const teammateScrollBox = document.querySelector('.teammate-scroll-box');
            const createDivAndSet = (tag, att) => {
                const element = document.createElement(tag);
                if (tag == 'div') {
                    element.setAttribute('class', att);
                } else if (tag == 'img') {
                    element.setAttribute('alt', att);
                    element.setAttribute('class', att);
                } else if (tag == 'a') {
                    element.setAttribute('class', att);
                } else if (tag == 'button') {
                    element.setAttribute('class', att);
                    element.setAttribute('id', this.id);
                }
                return element;
            }

            // teammate 생성
            const mate = createDivAndSet('div', 'mate');
            // profileImage img tag
            const profileImg = createDivAndSet('img', 'imgLink');
            // profileImage 요소 생성 
            const profileImage = createDivAndSet('div', 'profileImage');
            // studentName
            const studentName = createDivAndSet('div', 'studentName');
            // part
            const part = createDivAndSet('div', 'part');
            // description
            const description = createDivAndSet('div', 'description');
            // github img tag
            const githubImg = createDivAndSet('img', 'github');
            // github a tag
            const githubA = createDivAndSet('a', 'githubA');
            // githublink
            const githubLink = createDivAndSet('div', 'githubLink');
            // deleteButton
            const buttonDiv = createDivAndSet('div', 'btnDiv');
            const deleteButton = createDivAndSet('button', 'deleteBtn');
            // editButton
            const editButton = createDivAndSet('button', 'editBtn');

            // member 요소 생성
            deleteButton.classList.add('material-symbols-outlined');
            editButton.classList.add('material-symbols-outlined');
            profileImg.setAttribute('src', this.image);
            githubImg.setAttribute('src', '/image/githublogo.png');
            githubA.setAttribute('href', this.git);
            studentName.innerText = this.name;
            description.innerText = this.des;
            part.innerText = this.part;
            deleteButton.innerText = 'close';
            editButton.innerText = 'edit_note';
            buttonDiv.appendChild(editButton);
            buttonDiv.appendChild(deleteButton);
            mate.appendChild(buttonDiv);
            profileImage.appendChild(profileImg);
            mate.appendChild(profileImage);
            mate.appendChild(studentName);
            mate.appendChild(part);
            mate.appendChild(description);
            githubA.appendChild(githubImg);
            githubLink.appendChild(githubA);
            mate.appendChild(githubLink);
            teammateScrollBox.appendChild(mate);
        }

        setEventListener(index) {
        // eventListener for deleteBtn
        const deleteButton = document.querySelectorAll('.deleteBtn');
        deleteButton[index].addEventListener('click', (event) => {
            if (confirm('없애고 싶은 조원이 있나요?')) {
                const targetId = event.target.id;
                deleteTeammate(targetId)
                    .then(result => {
                        alert('삭제되었습니다!');
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
                    .catch(error => {
                        console.error(error);
                    }
                );
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
                        setInputValue(data);
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

    /* 실행 */
    getTeammate()
    .then(result => {
        const mateList = [...result];
        saveAndCreate(mateList);
    })
    .catch(error => {
        console.error(error);
    });

    getUser()
    .then(result => {
        if(result.user.master == 1) {
            console.log('loggedInAdmin');
            addTeammateButton('새로운 팀원이 생겼나요?');
            const teammateScrollBox = document.querySelector('.teammate-scroll-box');
            console.log(teammateScrollBox);
            const button = teammateScrollBox.querySelectorAll('.btnDiv');
            console.log(button);
            button.forEach((button) => {
                console.log(button);
                button.classList.add('admin');
            });
        }
    })
    .catch(error => {
        console.error(error);
    });

    /* 함수 */

    // 값을 배열 mateList에 저장하고 mate 클래스의 create,setEventListener 함수를 트리거
    const saveAndCreate = (mateList) => {
        for (let i = 0; i < mateList.length; i++) {
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
    };

    // 유효성 검사
    const validateInput = (modal) => {
        const selectedModal = document.querySelector(modal);
        const modalInput = selectedModal.querySelectorAll('input');
        console.log(modalInput);
        let isFirstValue = true;
        for(let index of modalInput) {
            if(!(index.type == 'file') && !(modal == '.editModal')) {
                const trimValue = index.value.trim();
                if(isFirstValue && isNaN(trimValue)) {
                    alert('학번은 숫자를 입력해주세요.');
                    return false;
                }
                if(!trimValue) {
                    alert('올바른 값을 입력해주세요.');
                    return false;
                }
            }
            isFirstValue = false;
        }
        return true;
    };

    // 수정 모달 호출 시 기본 값 입력
    const setInputValue = (arr) => {
        const editModal = document.querySelector('.editModal');
        const inputs = editModal.querySelectorAll('input[type="text"]');
        const addPreview = editModal.querySelector('img');
        for (let i = 0; i <= inputs.length; i++) {
            if (i == 0) {
                addPreview.src = arr[i];
            } else {
                inputs[i - 1].value = arr[i];
            }
        }
    };

    // 수정 중 모달을 닫을 때 입력했던 값을 지움
    const resetInputValue = () => {
        const editModal = document.querySelector('.editModal');
        const inputs = editModal.querySelectorAll('input');
        const addPreview = editModal.querySelector('img');
        for (let i = 0; i <= inputs.length; i++) {
            if (i == 0) {
                addPreview.src = '';
            } else {
                inputs[i - 1].value = '';
            }
        }
    };

    // 모달 닫기
    const closeModal = (target, className) => {
        target.classList.remove(className);
        setTimeout(() => {
            target.style.display = 'none';
        }, 800);
    };

    // 모달 열기
    const openModal = (target, className) => {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add(className);
        }, 100);
    };

    // 조원 추가 텍스트 버튼
    const addTeammateButton = (text) => {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.classList.add('addButton');
        const modal = document.querySelector('.modal');
        button.addEventListener('click', () => { openModal( modal, 'opacityQue') });
        const team = document.querySelector('.team');
        team.appendChild(button);
    };

    // 모달에 이미지를 업로드하면 프리뷰 해줌 ?
    const showImage = (event, imageTarget) => {
        let selectedFile = event.target.files[0];
        if (selectedFile) {
            let reader = new FileReader();
            reader.onload = function (event) {
                var fileDataUrl = event.target.result;
                var previewImage = document.querySelector(imageTarget);
                previewImage.src = fileDataUrl;
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // 추가, 수정 시 폼을 보내는 함수
    const appendFormData = (modalClass, fileId, method) => {
        const modal = document.querySelector(modalClass);
        const input = modal.querySelectorAll('input[type="text"]');
        const file = document.querySelector(fileId);
        const image = file.files[0];
        const formData = new FormData();
        formData.append('_method', method);
        formData.append('student_id', input[0].value);
        formData.append('name', input[1].value);
        formData.append('part', input[2].value);
        formData.append('description', input[3].value);
        formData.append('github_link', input[4].value);
        formData.append('profile_image', image);
        return formData;
    }

    /* 요청 */
    //현재 유저의 정보를 요청
    async function getUser() {
        const response = await fetch('http://127.0.0.1:8080/api/status', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    }
    // 조원 추가
    async function postTeammate() {
        fetch('http://localhost:8080/api/teammates', {
            method: 'POST',
            body: appendFormData('.modal', '#addProfileImage', 'POST'),
        });
    }
    // 특정 조원 삭제
    async function deleteTeammate(id) {
        fetch(`http://localhost:8080/api/teammates/${id}`, {
            method: 'DELETE',
        });
    }
    // 조원 정보를 서버에서 받아오는 함수
    async function getTeammate() {
        const response = await fetch("http://localhost:8080/api/teammates", {
            method: 'GET',
        });
        const data = await response.json();
        return data;
    }
    // 수정 요청 보내기
    async function putTeammate(id) {
        fetch(`http://localhost:8080/api/teammates/${id}`, {
            method: 'POST',
            body: appendFormData('.editModal', '#editProfileImage', 'PUT'),
        });
    }
    // 아이디로 조원 정보 검색 GET
    async function getMateById(id) {
        const response = await fetch(`http://localhost:8080/api/teammates/${id}`, {
            method: 'GET',
        });
        const data = await response.json();
        return data;
    }

    /* 이벤트 리스너 */
    // 조원 추가 전송 버튼 이벤트 리스너
    const addSubmit = document.querySelector('#addSubmit');
    addSubmit.addEventListener('click', () => {
        if (confirm('추가하시겠습니까?')) {
            if((!validateInput('.modal'))) {
                return;
            }
            postTeammate()
                .then(result => {
                    alert('추가되었습니다!');
                    // 페이지 새로 요청
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
                .catch(error => {
                    console.error(error);
            })
        }
    });

    // 조원 수정 전송 버튼 이벤트 리스너
    const editModalSubmitButton = document.querySelector('#editSubmit');
    editModalSubmitButton.addEventListener('click', () => {
        if (confirm('정말 수정하시겠습니까?')) {
            if((!validateInput('.editModal'))) {
                return;
            }
            const id = editModalSubmitButton.value;
            putTeammate(id).
                then(result => {
                    alert('수정되었습니다!');
                    // 페이지 새로 요청
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
                .catch(error => {
                    console.error(error);
                })
        }
    });

    // 추가 모달 닫기 이벤트 리스너
    const modal = document.querySelector('.modal');
    const modalclosebutton = document.querySelector('#closeAddModal');
    modalclosebutton.addEventListener('click', () => { closeModal(modal, 'opacityQue') });

    //  수정 모달 닫기 이벤트 리스너
    const editModalCloseButton = document.querySelector('#closeEditModal');
    const editModal = document.querySelector('.editModal');
    editModalCloseButton.addEventListener('click', () => {
        resetInputValue();
        closeModal(editModal, 'editOpacityQue');
    });
    
    // 이미지 프리뷰 이벤트 리스너
    const addImageUploader = document.querySelector('#addProfileImage');
    const editImageUploader = document.querySelector('#editProfileImage');
    addImageUploader.addEventListener('change', (event) => {
        showImage(event, '#addPreview');
    });

    editImageUploader.addEventListener('change', (event) => {
        showImage(event, '#editPreview');
    });

    // 스크롤 버튼 이벤트 리스너
    const leftScrl = document.querySelector('#leftScrl');
    const scrollBox = document.querySelector('.teammate-scroll-box');
    const rightScrl = document.querySelector('#rightScrl');
    
    leftScrl.addEventListener('click', (event) => {
        leftScrl.disabled = true;
        scrollBox.scrollBy(-370, 0);
        setTimeout(() => {
            leftScrl.disabled = false;
        }, 500)
    });

    rightScrl.addEventListener('click', (event) => {
        rightScrl.disabled = true;
        scrollBox.scrollBy(370, 0);
        setTimeout(() => {
            rightScrl.disabled = false;
        }, 500)
    });

    
    /* 타 페이지 연결 관련 코드 */

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
                for (let i = 0; i <= searchResults.length; i++) {
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