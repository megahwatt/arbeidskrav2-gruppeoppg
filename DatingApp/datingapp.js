const scoreElement = document.getElementById("score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const profileImgElement = document.querySelector(".profile-card img");

let likedProfiles = [];
let currentProfile;
let selectedGender = "both"; //default
let score = 10;

fetchRandomUser();

// Function to update score
function updateScore() {
  score--;
  scoreElement.textContent = score;
  if (score <= 0) {
    messageElement.textContent = "Out of swipes! Would you like to swipe more?";
    notInterestedBtn.disabled = true;
    interestedBtn.disabled = true;
  }
}

// Fetch en random profil og vis på siden
async function fetchRandomUser() {
  try {
    const response = await fetch(
      `https://randomuser.me/api/?gender=${selectedGender}`
    );
    const data = await response.json();
    const user = data.results[0];
    currentProfile = user;

    nameElement.innerHTML = `${user.name.first} ${user.name.last}`;
    locationElement.innerHTML = `${user.location.city}, ${user.location.country}`;
    profileImgElement.src = user.picture.large;
  } catch (error) {
    console.error("Error fetching random user:", error);
  }
}

// "SWIPE" piltast høyre/venstre
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    //interessert
    likedProfiles.unshift(currentProfile); //begrense til å bare kunne like en gang, så ikke man fyller arrayet med den samme profilen flere ganger
    console.log(likedProfiles);
    updateLikedProfilesList();
    updateScore();
    fetchRandomUser(selectedGender);
  } else if (e.key === "ArrowLeft") {
    //ikke interessert
    console.log("Du trykket venstre");
    fetchRandomUser(selectedGender);
  }
});

// Filtrering av kjønn
const filterWomen = document.querySelector("#filter-women");
const filterMen = document.querySelector("#filter-men");
const filterBoth = document.querySelector("#filter-both");

filterWomen.addEventListener("click", function () {
  updateSelectedGender("women");
});

filterMen.addEventListener("click", function () {
  updateSelectedGender("men");
});

filterBoth.addEventListener("click", function () {
  updateSelectedGender("both");
});

function updateSelectedGender(gender) {
  selectedGender = gender;
  fetchRandomUser(selectedGender);
}

// Oversikt over likte profiler - ikke ferdig

function updateLikedProfilesList() {
  likedProfiles.forEach((profile) => {
    const card = document.createElement("div");
    card.innerHTML = `<img src="${profile.picture.large}"> <p> ${profile.name.first} ${profile.name.last},${profile.location.city}, ${profile.location.country} </p>`;

    const likedProfileContainer = document.querySelector(
      ".liked-profiles-container"
    );

    likedProfileContainer.append(card);
  });
}
