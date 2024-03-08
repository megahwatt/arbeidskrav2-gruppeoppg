const scoreElement = document.getElementById("score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const ageElement = document.querySelector(".age"); // Add this line
const profileImgElement = document.querySelector(".profile-card img");
const editBtn = document.getElementById("edit-profile");
const messageElement = document.getElementById("message");

let score = 10;
let likedProfiles = [];
let currentProfile;
let selectedGender;

// Function to update score
function updateScore() {
  score--;
  scoreElement.textContent = score;
  if (score <= 0) {
    const response = prompt(
      "Tom for sveip! Vil du sveipe mer? Ja/Nei"
    );
    if (response && response.toLowerCase() === "ja") {
      score = 10;
      scoreElement.textContent = score;
      messageElement.textContent = "";
      notInterestedBtn.disabled = false;
      interestedBtn.disabled = false;
    } else {
      messageElement.textContent =
        "Kom tilbake senere når du er klar til å sveipe mer!";
      notInterestedBtn.disabled = true;
      interestedBtn.disabled = true;
    }
  }
}

// Fetch random profile
async function fetchRandomUser(gender) {
  try {
    const response = await fetch(
      `https://randomuser.me/api/?gender=${gender}`
    );
    const data = await response.json();
    const user = data.results[0];
    user.gender = gender; //
    currentProfile = user;

    nameElement.innerHTML = `${user.name.first} ${user.name.last}`;
    locationElement.innerHTML = `${user.location.city}, ${user.location.country}`;
    ageElement.innerHTML = `${user.dob.age}`; // Vis alderen
    profileImgElement.src = user.picture.large;
  } catch (error) {
    console.error("Feil ved henting av tilfeldig bruker:", error);
  }
}

// Filter by sex
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
  console.log("Inside updateSelectedGender", selectedGender); // console logg
  fetchRandomUser(selectedGender);
}

// Event listener for edit button
editBtn.addEventListener("click", () => {
  const newName = prompt("Skriv inn nytt navn:");
  const newLocation = prompt("Skriv inn ny plassering:");
  const newAge = prompt("Skriv inn ny alder:");

  // Oprofile information update
  nameElement.textContent = newName;
  locationElement.textContent = newLocation;

  // likedProfiles-arrayen update
  likedProfiles = likedProfiles.map((profile) => {
    if (profile.name === nameElement.textContent) {
      return {
        ...profile,
        name: newName,
        location: newLocation,
        dob: { ...profile.dob, age: newAge }
      };
    }
    return profile;
  });
  //  localStorage profil information update.

  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
});

// "SWIPE" right/left
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    //interested
    likedProfiles.unshift(currentProfile); //restriction to being able to like only once, so you don't fill the array with the same profile multiple times
    console.log(likedProfiles);
    updateLikedProfilesList();
    updateScore();
    fetchRandomUser(selectedGender);
  } else if (e.key === "ArrowLeft") {
    //NOT INTERESTED
    fetchRandomUser(selectedGender);
  }
});

//Updates list of liked profiles
function updateLikedProfilesList() {
  const likedProfileContainer = document.querySelector(
    ".liked-profiles-container"
  );

  likedProfileContainer.innerHTML = "";

// liked profiles
  likedProfiles.forEach((profile) => {
    const card = document.createElement("div");
    card.classList.add("liked-profile");

    const editButton = document.createElement("button");
    editButton.textContent = "Redigere profil";
    editButton.addEventListener("click", () => editProfile(profile));

    card.innerHTML = `
      <img src="${profile.picture.large}">
      <p>Navn: ${profile.name.first} ${profile.name.last}</p>
      <p>Alder: ${profile.dob.age}</p>
      <p>Plassering: ${profile.location.city}, ${profile.location.country}</p>`;
    
    card.appendChild(editButton);
    likedProfileContainer.appendChild(card);
  });
}

// Function to edit liked profile
function editProfile(profile) {
  const newName = prompt("Skriv inn nytt navn:");
  const newLocation = prompt("Skriv inn ny plassering:");
  const newAge = prompt("Skriv inn ny alder:");

  // prifile update
  profile.name.first = newName;
  profile.location.city = newLocation;
  profile.dob.age = newAge;

  // localStorage update
  updateLikedProfilesList();
  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}

// Initial fetch on page load
window.addEventListener("load", () => {
  fetchRandomUser("");
});
