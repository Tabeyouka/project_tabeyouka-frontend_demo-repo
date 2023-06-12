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
document.addEventListener("DOMContentLoaded", function () {
  const ratingStars = [...document.getElementsByClassName("rating__star")];
  executeRating(ratingStars);
  restaurantDataLoad();
});

// 가게 정보 불러오기
const restaurantDataLoad = () => {
  fetch("http://localhost:8080/api/restaurants/1", {
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
      console.log(reviewData.restaurant_id);
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

// // 리뷰 달기
const reviewCreateBtn = () => {
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
};

// 리뷰 입력 값을 commentData에 저장
const commentValue = document.querySelector("#comment-input");
commentValue.addEventListener("input", () => {
  reviewData.review_text = commentValue.value;
  console.log(reviewData);
});

//별점 기능
function executeRating(stars) {
  const starClassActive = "rating__star fas fa-star";
  const starClassInactive = "rating__star far fa-star";

  stars.forEach((star) => {
    star.onclick = () => {
      const selectedIndex = stars.indexOf(star);

      if (star.className === starClassInactive) {
        for (let i = 0; i <= selectedIndex; i++) {
          stars[i].className = starClassActive;
        }
        for (let i = selectedIndex + 1; i < stars.length; i++) {
          stars[i].className = starClassInactive;
        }
        selectedRating = selectedIndex + 1;
      } else {
        for (let i = 0; i < stars.length; i++) {
          stars[i].className = starClassInactive;
        }
        selectedRating = 0;
      }
      reviewData.rating = selectedRating;
      console.log(selectedRating);
    };
  });
}

let testData = {};

const test = () => {
  fetch(`http://localhost:8080/api/reviews/1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(reviewData),
  })
    .then((response) => {
      console.log("응답 받음:", response);
    })
    .catch((error) => {
      // 오류 처리
      console.error("오류 발생:", error);
    });
};
