(() => {
  let restaurantData = [];

  // 리뷰 댓글 내용 저장
  let commentData2 = new FormData(); // 입력받은 댓글을 저장
  let reviewData3 = []; // 리뷰생성용 데이터

  // // 댓글내용 불러오기

  let num = Number(document.hash);

  // 리뷰 정보 불러오기
  let i = localStorage.getItem("id");
  const reviewDataLoad = () => {
    fetch(`http://localhost:8080/api/restaurants/${i}`, {
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
        // console.log("리뷰응답:", data);
        commentData2.append("restaurant_id", data.restaurant.id);
        // commentData2.append("rating", data.reivews.rating);
        reviewData3 = data.reviews;
        // console.log("이거", reviewData3);
        // console.log("이미지222", data.reviews[0].image_file);
        // console.log;
        createComments();
      })
      .catch((error) => {
        console.error("오류 발생:", error);
      });
  };
  reviewDataLoad(i);

  // 로그인 한 유저정보 저장
  let userInfo = [];
  const getUserInfo = () => {
    fetch("http://127.0.0.1:8080/api/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((statusResponse) => {
        if (!statusResponse.ok) {
          throw new Error("서버 응답이 실패했습니다.");
        }

        return statusResponse.json();
      })
      .then((data) => {
        // console.log("응답 받음:", data.user);
        userInfo = data.user;
        commentData2.append("author_id", data.user.id); //commentData2에 id 저장
        commentData2.append("nickname", data.user.nickname); //commentData2에 nickname 저장
        // console.log("유저인포아이디", userInfo);
        document.querySelector("#commentAreaName").textContent =
          userInfo.nickname;
      });
  };

  getUserInfo();
  // console.log(userInfo);

  // 입력받은 값을 commentData2에 저장
  const commentValue = document.querySelector("#comment-input");
  commentValue.addEventListener("input", () => {
    // console.log("3232", commentValue.value);
    commentData2.append("review_text", commentValue.value); // 댓글 unput 값 commentData2에 저장
    // console.log("1", commentData2.get("image_file"));
    // console.log("2", commentData2.get("review_text"));
    // console.log("3", commentData2.get("nickname"));
    // console.log("4", commentData2.get("author_id"));
    // console.log("5", commentData2.get("rating"));
    // console.log("6", commentData2.get("restaurant_id"));
  });

  // 사진 commentData2에 저장
  document.querySelector("#testpng").addEventListener("click", () => {
    const file = imageInput.files[0];
    commentData2.append("image_file", file);
  });

  // 댓글달기. 등록버튼을 누르면 댓글을 서버로 POST 후 댓글을 다시 불러옴
  const commentCreate = document.querySelector("#comment-btn");
  commentCreate.addEventListener("click", () => {
    fetch(`http://localhost:8080/api/review`, {
      method: "POST",
      body: commentData2,
    })
      .then((response) => {
        // console.log("응답 받음:", response);
        reviewDataLoad();
      })
      .catch((error) => {
        console.error("오류 발생:", error);
      });
    commentValue.value = ""; // 댓글 작성 후 input 초기화
  });

  // // 댓글 수정 기능
  // let editCommentData = {}; // 수정한 댓글을 저장
  let editReviewData = new FormData();
  let checkUser = {};
  const commentEdit = () => {
    const editButtons = document.querySelectorAll(".reply-edit");
    const modalBodyText = document.querySelector("#modalBodyText");

    // 각 댓글들의 수정버튼마다 모달창 띄우고, 댓글의 고유 id번호와 고유 author_id를 editCommentData에 저장
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // 댓글의 고유번호 저장하기
        const replyText = e.target.closest(".reply-text01");
        editReviewData.append("id", replyText.getAttribute("data-id1"));
        editReviewData.append("author_id", replyText.getAttribute("data-id2"));
        editReviewData.append("rating", replyText.getAttribute("data-id3"));
        // console.log("데이터 제데로?2222", editReviewData.get("id"));
        checkUser.author_id = replyText.getAttribute("data-id2");
        editReviewData.append("nickname", "test0613");
        //모달 창 띄우기
        if (userInfo.id != checkUser.author_id) {
          alert("수정 권한이 없습니다.");
        } else {
          const ratingStars2 = document.querySelectorAll(".rating2__star");
          ratingStars2.forEach((star, index) => {
            star.addEventListener("click", () => {
              // 클릭될때마다 모든별들을 돌면서 조건 확인
              ratingStars2.forEach((star, i) => {
                // 클릭된 별의 index가 같거나 크면 그 스타들 전부 채움
                if (i <= index) {
                  star.className = "rating2__star fas fa-star";
                }
                // 아니면 초기화
                else {
                  star.className = "rating2__star far fa-star";
                }
              });
              selectedRating2 = index + 1; // 클릭한 별점을 변수에 저장
              editReviewData.append("rating", selectedRating2);
            });
          });

          const modal = document.querySelector(".modal");
          modal.style.display = "block";
          document.querySelector("#testpng2").addEventListener("click", () => {
            // console.log("imageselected");
            const inputFile = document.getElementById("imageInput2");
            const imageFile = inputFile.files[0];
            if (imageFile) {
              editReviewData.append("image_file", imageFile);
              // console.log("폼데이터는", editReviewData.get("image_file"));
              // console.log("이미지 파일이 선택되었습니다:", imageFile);
            }
          });
          // console.log("댓글의 고유 아이디:", editReviewData);
        }
      });
    });

    // 수정 하는 인풋값을 editCommentData에 저장
    modalBodyText.addEventListener("input", () => {
      if (modalBodyText.value === "") {
        document.querySelector("#ErrorMsg").innerHTML =
          "수정할 내용을 입력해주세요.";
      } else {
        document.querySelector("#ErrorMsg").innerHTML = "";
      }
      // console.log(modalBodyText.value);
      editReviewData.append("review_text", modalBodyText.value);
      // console.log("수정은1", editReviewData.get("image_file"));
      // console.log("수정은2", editReviewData.get("id"));
      // console.log("수정은3", editReviewData.get("review_text"));
      // console.log("수정은4", editReviewData.get("author_id"));
      // console.log("수정은5", editReviewData.get("rating"));
      // console.log("수정은5", editReviewData.get("nickname"));
    });
  };

  // 수정완료 버튼을 누르면 수정된 데이터를 서버로 POST 후 댓글을 다시 불러옴

  document.querySelector("#modalEditBtn").addEventListener("click", () => {
    editReviewData.append("_method", "PATCH");
    if (modalBodyText.value === "") {
      document.querySelector("#ErrorMsg").innerHTML =
        "수정할 내용을 입력해주세요.";
      return;
    } else {
      document.querySelector(".modal").style.display = "none";
      document.querySelector("#modalBodyText").value = "";

      fetch(`http://localhost:8080/api/review`, {
        method: "POST",

        body: editReviewData,
      })
        .then((response) => {
          // console.log("응답 받음:", response);
          reviewDataLoad();
        })
        .catch((error) => {
          console.error("오류 발생:", error);
        });
      return;
    }
  });

  // 수정취소 버튼
  document.querySelector("#modalCancelBtn").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "none";
    document.querySelector("#modalBodyText").value = "";
    document.querySelector("#ErrorMsg").innerHTML = "";
  });

  // 댓글 삭제
  let delCommentData = {};

  const commentDel = () => {
    const delButtons = document.querySelectorAll(".reply-del");

    // 각 댓글들의 댓글의 고유 id번호와 고유 author_id를 delCommentData 저장
    delButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // 댓글의 고유번호 저장하기
        const replyText = e.target.closest(".reply-text01");
        delCommentData.id = replyText.getAttribute("data-id1");
        checkUser.author_id = replyText.getAttribute("data-id2");

        // console.log("댓글의 고유 아이디:", delCommentData);

        if (checkUser.author_id != userInfo.id) {
          alert("삭제 권한이 없습니다.");
        } else {
          const confirmation = confirm("정말로 삭제하시겠습니까?");

          if (confirmation) {
            const id = delCommentData.id;
            fetch(`http://localhost:8080/api/review/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json ",
              },
              body: JSON.stringify(delCommentData),
            })
              .then((response) => {
                // console.log("응답 받음:", response);
                reviewDataLoad();
              })
              .catch((error) => {
                // console.error("오류 발생:", error);
              });
          } else {
            return;
          }
        }
      });
    });
  };

  // // 댓글 html 생성

  const createComments = () => {
    const commentsSection = document.querySelector(".comments");
    commentsSection.innerHTML = "";
    // console.log(reviewData3);
    // 주어진 데이터를 반복하여 댓글 요소를 생성하고 추가
    reviewData3.forEach((review) => {
      const replyText = document.createElement("div");
      replyText.className = "reply-text01";
      replyText.setAttribute("data-id2", review.author_id);
      replyText.setAttribute("data-id1", review.id);
      replyText.setAttribute("data-id3", review.rating);
      const replyBody = document.createElement("div");
      replyBody.className = "reply-body";

      const replyName = document.createElement("h4");
      replyName.className = "reply-name";
      replyName.textContent = review.nickname;

      const star = document.createElement("div");
      star.className = "rating";
      if (review.rating == 5) {
        star.textContent = "⭐⭐⭐⭐⭐";
      } else if (review.rating == 4) {
        star.textContent = "⭐⭐⭐⭐";
      } else if (review.rating == 3) {
        star.textContent = "⭐⭐⭐";
      } else if (review.rating == 2) {
        star.textContent = "⭐⭐";
      } else if (review.rating == 1) {
        star.textContent = "⭐";
      } else {
        star.textContent = "별점이 없어요!";
      }

      const image = document.createElement("img");
      image.className = "image-element";
      image.src = review.image_file;

      if (review.image_file == "IMAGEDESU") {
        image.src = "";
      }

      const replyDel = document.createElement("button");
      replyDel.className = "reply-del";
      replyDel.textContent = "삭제";
      const replyEdit = document.createElement("button");
      replyEdit.className = "reply-edit";
      replyEdit.textContent = "수정";

      const replyContent = document.createElement("p");
      replyContent.className = "reply-content";
      replyContent.textContent = review.review_text;

      commentsSection.appendChild(replyText);
      replyText.appendChild(replyBody);
      replyBody.appendChild(replyDel);
      replyBody.appendChild(replyEdit);
      replyBody.appendChild(replyName);
      replyBody.appendChild(star);
      replyBody.appendChild(replyContent);
      replyBody.appendChild(image);
    });

    commentEdit();
    commentDel();
  };

  // let storeNumber = Number(document.hash); // 수정 X
  let id = localStorage.getItem("id");
  // 수정 X
  // 가게 정보 불러오기

  const mainName = document.querySelector(".mainName");
  const tags = document.querySelector(".tags");
  const address = document.querySelector("#address");
  const infoTags = document.querySelector("#infoTags");
  const mainImg = document.querySelector(".mainImg");
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
        // console.log("응답 받음:", data);
        restaurantData = data;

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
  restaurantDataLoad(id);

  // input 요소 클릭 이벤트
  let input = document.querySelector(".form-control");

  // 클릭 시 주황색 실선 표시
  input.addEventListener("click", function () {
    this.style.borderBottom = "3px solid orange";
  });
  // 클릭해제 시 실선 제거
  input.addEventListener("blur", function () {
    this.style.borderBottom = "none";
  });

  // 수정 X
  //별점click
  const ratingStars = document.querySelectorAll(".rating__star");
  ratingStars.forEach((star, index) => {
    star.addEventListener("click", () => {
      // 클릭될때마다 모든별들을 돌면서 조건 확인
      ratingStars.forEach((star, i) => {
        // 클릭된 별의 index가 같거나 크면 그 스타들 전부 채움
        if (i <= index) {
          star.className = "rating__star fas fa-star";
        }
        // 아니면 초기화
        else {
          star.className = "rating__star far fa-star";
        }
      });
      selectedRating = index + 1; // 클릭한 별점을 변수에 저장
      commentData2.append("rating", selectedRating);
    });
  });

  // 자유게시판 연결
  const board = document.querySelector(".board");
  board.addEventListener("click", () => {
    fetch("/community/list.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
        while (document.documentElement.firstChild) {
          document.documentElement.removeChild(
            document.documentElement.firstChild
          );
        }

        const search_html = document.querySelector("html");
        const head = document.createElement("head");
        const body = document.createElement("body");
        search_html.appendChild(head);
        search_html.appendChild(body);

        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);

        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css";
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
  });

  // 로그인 연결
  const clickLogin = document.querySelector(".loginText");
  clickLogin.addEventListener("click", () => {
    // 로그인 성공 시 SPA로 main 페이지 요소들을 보여줌
    fetch("/signin/login.html", { credentials: "include" })
      .then((response) => response.text())
      .then((html) => {
        while (document.documentElement.firstChild) {
          document.documentElement.removeChild(
            document.documentElement.firstChild
          );
        }

        const search_html = document.querySelector("html");
        const head = document.createElement("head");
        const body = document.createElement("body");
        search_html.appendChild(head);
        search_html.appendChild(body);

        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);

        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css";
        mainStyle.rel = "stylesheet";
        mainStyle.href = "/signin/css/login.css";
        document.head.appendChild(mainStyle);

        // main.html과 관련된 JavaScript 파일 추가
        const mainScript = document.createElement("script");
        mainScript.src = "/signin/javascript/login.js";
        document.body.appendChild(mainScript);
      });
  });

  // 현지학기제 연결
  const introduce = document.querySelector(".introduce");
  introduce.addEventListener("click", () => {
    fetch("/introducepage/introduce.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
        while (document.documentElement.firstChild) {
          document.documentElement.removeChild(
            document.documentElement.firstChild
          );
        }

        const search_html = document.querySelector("html");
        const head = document.createElement("head");
        const body = document.createElement("body");
        search_html.appendChild(head);
        search_html.appendChild(body);

        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);

        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css";
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
  });

  async function reviewSearch(id) {
    const response = await fetch(
      `http://localhost:8080/api/restaurants/${id}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  }

  // 검색시 화면전환

  const submit = document.querySelector("#inputForm");
  submit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const search_word = input.value;

    async function requestSearch() {
      const response = await fetch(`http://localhost:8080/api/restaurants`, {
        method: "GET",
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
          document.documentElement.removeChild(
            document.documentElement.firstChild
          );
        }

        const search_html = document.querySelector("html");
        const head = document.createElement("head");
        const body = document.createElement("body");
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
          const ol = document.querySelector(".searchInfo-space");
          ol.style.cssText =
            "height: 500px; justify-content: center; flex-direction: column; align-items: center;";
          // justify-content: center;
          const text = document.createElement("h1");
          text.textContent = `${search_word}를(을) 찾을 수 없습니다.`;
          ol.appendChild(text);
          const home_button = document.createElement("button");
          home_button.textContent = "홈으로";
          home_button.classList.add("btn", "btn-warning");
          ol.appendChild(home_button);
        }

        // 검색결과의 length만큼 요소 생성
        for (let i = 0; i <= searchResults.length; i++) {
          information = searchResults[i];

          const ol = document.querySelector(".searchInfo-space");

          const li = document.createElement("li");
          li.classList.add("searchInfo-infoContainer");

          const a = document.createElement("a");
          a.href = "#";

          const infoHead = document.createElement("div");
          infoHead.classList.add("info-header");

          const img = document.createElement("img");
          img.src = information.image;
          img.alt = "";

          const info = document.createElement("div");
          info.classList.add("info");

          const infoTitleContainer = document.createElement("div");
          infoTitleContainer.classList.add("info-title-container");

          const h1 = document.createElement("h1");
          h1.classList.add("info-title");
          h1.textContent = information.title;

          const infoTagContainer = document.createElement("div");
          infoTagContainer.classList.add("info-tag-container");

          const infoTag = document.createElement("p");
          infoTag.textContent = information.menu_type;

          const rate = document.createElement("div");
          rate.classList.add("rate");

          const score = document.createElement("p");
          score.classList.add("score");
          score.textContent = "0점";

          const span1 = document.createElement("span");
          span1.textContent = "|";

          const faStar = document.createElement("p");
          faStar.classList.add("fa", "fa-star", "checked");

          const userScore = document.createElement("p");
          userScore.classList.add("user-score");
          userScore.textContent = information.total_points;

          const span2 = document.createElement("span");
          span2.textContent = "|";

          const comment = document.createElement("p");
          comment.classList.add("comment");
          comment.textContent = `${information.total_votes}명`;

          const reviewContainer = document.createElement("div");
          reviewContainer.classList.add("review-container");

          const reviewSpan = document.createElement("span");
          reviewSpan.classList.add("review");
          reviewSearch(information.id)
            .then((data) => {
              reviewSpan.textContent = data.reviews[0].review_text;
            })
            .catch((error) => {
              // 리뷰가 없으면 리뷰가 없다를 표시
              reviewSpan.textContent = "리뷰가 없습니다.";
            });

          const locationContainer = document.createElement("div");
          locationContainer.classList.add("location-container");

          const location = document.createElement("p");
          location.classList.add("location");
          location.textContent = information.address;

          const idNumber = information.id;
          const id = document.createElement("p");
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
        }
      });
  });

  // 검색어 필터
  function filterArrayByWord(originalArray, word) {
    const filteredArray = [];

    for (let i = 0; i < originalArray.length; i++) {
      const item = originalArray[i];
      // includes로 null값을 찾으려할때 오류가 발생하기때문에
      // null값을 처리하는 조건문도 작성

      if (
        (item.title && item.title.includes(word)) ||
        (item.menu_type && item.menu_type.includes(word))
      ) {
        filteredArray.push(item);
      }
    }
    if (filteredArray.length === 0) {
      return false;
    }
    return filteredArray;
  }

  // 조원소개 연결
  const teammate = document.querySelector(".teammate");
  teammate.addEventListener("click", () => {
    fetch("/teammate/teammate.html", { credentials: "include" }) // 메인 페이지 요청에도 쿠키를 포함
      .then((response) => response.text())
      .then((html) => {
        while (document.documentElement.firstChild) {
          document.documentElement.removeChild(
            document.documentElement.firstChild
          );
        }

        const search_html = document.querySelector("html");
        const head = document.createElement("head");
        const body = document.createElement("body");
        search_html.appendChild(head);
        search_html.appendChild(body);

        const range = document.createRange();
        const parsedHTML = range.createContextualFragment(html);
        document.body.appendChild(parsedHTML);

        const mainStyle = document.createElement("link");
        mainStyle.type = "text/css";
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
  });
})();
