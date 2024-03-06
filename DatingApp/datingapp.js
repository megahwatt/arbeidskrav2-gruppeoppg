const scoreElement = document.getElementById("score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const profileImgElement = document.querySelector(".profile-card img");
const editBtn = document.getElementById("edit-profile");
const messageElement = document.getElementById("message");

let score = 10;
let likedProfiles = [];
let currentProfile;
let selectedGender = "both"; //default

// Function to update score
function updateScore() {
  score--;
  scoreElement.textContent = score;
  if (score <= 0) {
    const response = prompt(
      "Out of swipes! Would you like to swipe more? Yes/No"
    );
    if (response && response.toLowerCase() === "yes") {
      score = 10;
      scoreElement.textContent = score;
      messageElement.textContent = "";
      notInterestedBtn.disabled = false;
      interestedBtn.disabled = false;
    } else {
      messageElement.textContent =
        "Come back later when you're ready to swipe more!";
      notInterestedBtn.disabled = true;
      interestedBtn.disabled = true;
    }
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

// Event listener for edit button
editBtn.addEventListener("click", () => {
  const newName = prompt("Enter new name:");
  const newLocation = prompt("Enter new location:");

  // Update profile information
  nameElement.textContent = newName;
  locationElement.textContent = newLocation;

  // Update information in likedProfiles array
  likedProfiles = likedProfiles.map((profile) => {
    if (profile.name === nameElement.textContent) {
      return {
        ...profile,
        name: newName,
        location: newLocation,
      };
    }
    return profile;
  });
  // Update information in localStorage
  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
});

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

// Initial fetch on page load
window.addEventListener("load", () => {
  fetchRandomUser("");
});
