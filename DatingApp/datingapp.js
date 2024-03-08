const scoreElement = document.getElementById("score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const profileImgElement = document.querySelector(".profile-card img");
const messageElement = document.getElementById("message");
const likedProfileContainer = document.querySelector(
  ".liked-profiles-container"
);

let score = 10;
let likedProfiles = [];
let currentProfile;
let selectedGender;

// Function to update score
function updateScore() {
  score--; //her må score hente inn antall likedProfiles fra localStorage og regne ut hvor mange poeng som er igjen. Denne funksjonen må også kjøres ved page load.
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

    //Ulik styling på kortet for mann/kvinne
    const container = document.querySelector(".container");
    if (currentProfile.gender == "female") {
      container.style.backgroundColor = "red";
    } else {
      container.style.backgroundColor = "blue";
    }
  } catch (error) {
    console.error("Error fetching random user:", error);
  }
}

// Filtrering av kjønn
const filterWomen = document.querySelector("#filter-women");
const filterMen = document.querySelector("#filter-men");
const filterBoth = document.querySelector("#filter-both");

filterWomen.addEventListener("click", function () {
  updateSelectedGender("female");
});

filterMen.addEventListener("click", function () {
  updateSelectedGender("male");
});

filterBoth.addEventListener("click", function () {
  updateSelectedGender("");
});

function updateSelectedGender(gender) {
  selectedGender = gender;
  console.log("Inne i updateSelectedGender", selectedGender);
  fetchRandomUser(selectedGender);
}

// "SWIPE" piltast høyre/venstre
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    //interessert
    saveLikedProfile();
    updateLikedProfilesList();
    updateScore();
    fetchRandomUser(selectedGender);
  } else if (e.key === "ArrowLeft") {
    //ikke interessert
    fetchRandomUser(selectedGender);
  }
});

function saveLikedProfile() {
  likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || []; //sjekker om det ligger noe lagret fra før
  likedProfiles.unshift(currentProfile);
  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}

//Oppdaterer liste over likte profiler
function updateLikedProfilesList() {
  likedProfileContainer.innerHTML = "";

  likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || []; //sjekker om det ligger noe lagret fra før

  likedProfiles.forEach((profile, index) => {
    //lager profil-kortet
    const card = document.createElement("div");
    card.innerHTML = `<img src="${profile.picture.large}"> <p> ${profile.name.first} ${profile.name.last},${profile.location.city}, ${profile.location.country} </p>`;

    //slette-knapp
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteProfile(index); //funksjonen er ikke laget enda
    });

    //rediger-knapp
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "Edit";
    editBtn.addEventListener("click", function () {
      editProfile(index); //må man ha index her også?
    });

    card.append(editBtn, deleteBtn);
    likedProfileContainer.append(card);
  });
}

// Edit profiles
function editProfile() {
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
}

// Initial fetch on page load
window.addEventListener("load", () => {
  fetchRandomUser("");
  updateLikedProfilesList();
});
