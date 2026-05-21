let movieBoard = document.querySelector("#movieBoard");
let apikey = "ea783e12aac21029af91514490c57fe5";

// 서버에서 원하는 영화 가지고 오기
movie = async (lists) => {
  let response = await fetch(
    `https://api.themoviedb.org/3/movie/${lists}?api_key=${apikey}&language=ko-KR`,
  );

  let data = await response.json();
  console.log(data);

  movieList = data.results;
  console.log(movieList);
  render(movieList);
};

// 창 뜨자마자 현재상영영화 나오게
movie("now_playing");

// 화면에 나타내는 함수
render = (movieList) => {
  movieBoard.innerHTML = "";
  movieList.forEach((movie) => {
    // console.log(movie.title)
    console.log(movie.poster_path);

    card = `
      <div class="card">
          <div class="imgBox"> 
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <p class="avg"><span>평점</span>${Math.round(movie.vote_average)}</p>
          </div>
          <div class="infoBox">
            <h2>${movie.title}</h2>
            <p class="overview">${over(movie.overview, 100)}</p>
          </div>
        </div>`;

    movieBoard.innerHTML += card;
  });
};

function over(text, limit) {
  // console.log(text.length);
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

movie("now_playing");

// 검색버튼
// searchInput, searchBtn
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");

// searchBtn을 클릭하면
searchBtn.addEventListener("click", async () => {
  // console.log("클릭")
  let keyword = searchInput.value;
  // console.log(keyword)

  let response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${keyword}&api_key=${apikey}&language=ko-KR`,
  );

  let data = await response.json();
  console.log(data);

  movieList = data.results;
  console.log(movieList);
  render(movieList);
});

// 엔터치면 검색됨
searchInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    searchBtn.click();
  }
});
