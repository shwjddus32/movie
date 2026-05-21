let movieBoard = document.querySelector("#movieBoard");

// [수정] 스크립트 상단에 메인 비주얼 관련 DOM 변수들을 명확하게 선언해 줍니다.
let heroSection = document.querySelector("#heroSection");
let heroTitle = document.querySelector("#heroTitle");
let heroOverview = document.querySelector("#heroOverview");

let apikey = "ea783e12aac21029af91514490c57fe5";

let currentPage = 1;
let currentList = "now_playing";

// 비동기 영화 데이터 호출 함수
const movie = async (lists, page = 1) => {
  currentPage = page;
  currentList = lists;

  let response = await fetch(
    `https://api.themoviedb.org/3/movie/${lists}?api_key=${apikey}&language=ko-KR&page=${currentPage}`,
  );

  let data = await response.json();
  let movieList = data.results;

  // [수정] 1페이지 리스트를 처음 불러올 때, 배열의 첫 번째(0등) 영화 데이터를 상단 배너에 채워줍니다.
  if (page === 1 && movieList.length > 0) {
    renderHero(movieList[0]);
  }

  render(movieList);
};

// 메인 비주얼에 데이터를 주입하는 함수
const renderHero = (topMovie) => {
  // 백드롭 이미지가 없을 경우를 위한 예외 처리 코드 추가
  let bgPath = topMovie.backdrop_path
    ? topMovie.backdrop_path
    : topMovie.poster_path;
  let bgUrl = `https://image.tmdb.org/t/p/original${bgPath}`;

  heroSection.style.backgroundImage = `url('${bgUrl}')`;
  heroTitle.innerText = topMovie.title;
  heroOverview.innerText = over(topMovie.overview, 150); // 배너 설명은 좀 더 여유 있게 끊기
};

// 하단 카드 리스트 출력 함수
const render = (movieList) => {
  movieBoard.innerHTML = "";
  movieList.forEach((movie) => {
    let posterImg = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    let card = `
              <div class="card">
                <div class="imgBox"> 
                  <img src="${posterImg}">
                  <p class="avg"><span>⭐️</span>${Math.round(movie.vote_average)}</p>
                </div>
                <div class="infoBox">
                  <h2>${movie.title}</h2>
                  <p class="overview">${over(movie.overview, 100)}</p>
                </div>
              </div>`;

    movieBoard.innerHTML += card;
  });
};

// 문자열 글자 제한 처리 유틸 함수
function over(text, limit) {
  if (!text) return "등록된 영화 소개 정보가 존재하지 않습니다.";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

// 첫 로드 시 실행 (기존 하단 중복 호출 코드 통합 제거)
movie("now_playing");

// 검색 인풋창 및 버튼 연동 로직
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");

searchBtn.addEventListener("click", async () => {
  let keyword = searchInput.value;

  if (keyword == "") {
    alert("검색어를 입력하세요");
    return;
  }

  let response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${keyword}&api_key=${apikey}&language=ko-KR`,
  );

  let data = await response.json();
  let movieList = data.results;

  if (movieList.length > 0) {
    // [수정] 검색 성공 시에도 가장 검색 정확도가 높은 첫 번째 영화를 메인 비주얼 배너에 연동합니다.
    renderHero(movieList[0]);
    render(movieList);
  } else {
    alert("검색 결과가 존재하지 않습니다.");
  }
  searchInput.value = "";
});

// 더보기 버튼 이벤트 처리
let more = document.querySelector("#more");
more.addEventListener("click", () => {
  currentPage++;
  movie(currentList, currentPage);
});

// 엔터 키 바인딩 처리
searchInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    searchBtn.click();
  }
});
