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

const click = document.querySelector('#click');
document.addEventListener('DOMContentLoaded', getData);

async function getData() {
    const response = await fetch("http://localhost:8080/api/teammates", {
        method: 'GET',
    });
    const data = await response.json();
    console.log(data);
    return data;
}

const profileImage = document.querySelectorAll('.profileImage')
const studentName = document.querySelectorAll('.studentName');
const studentId = document.querySelectorAll('.studentId');
const parts = document.querySelectorAll('.part');
const descriptions = document.querySelectorAll('.description');
const githubLink = document.querySelectorAll('.githubLink');

getData()
    .then(result => {
        const data = [...result];
        let count = 0;
        for(const obj of data) {
            const {                 
                profile_image, 
                name, 
                student_id, 
                part, 
                description, 
                github_link,
            } = obj;
            profileImage[count].querySelector('img').setAttribute('src', profile_image);
            studentName[count].innerText = name;
            studentId[count].innerText = student_id;
            parts[count].innerText = part;
            descriptions[count].innerText = description;
            githubLink[count].querySelector('a').setAttribute('href', github_link);
            count++;
        }
    })
    .catch(error => {
        console.error(error);
    });



// async function main() {
//     const data = await getData();
    
//     const jsonArray = [...data];

//     for (const obj of jsonArray) {
//         console.log(obj.student_id);
//     }

//     jsonArray.forEach((obj) => console.log(obj.student_id))

//     jsonArray[0].student_id;
    
//     console.log(jsonArray)
// }

// main();