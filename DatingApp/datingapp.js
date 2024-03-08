const scoreElement = document.getElementById("score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const profileImgElement = document.querySelector(".profile-card img");
const editBtn = document.getElementById("edit-profile");
const messageElement = document.getElementById("message");

let score = 10;
let likedProfiles = [];
let currentProfile;

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
let selectedGender;

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

// Event listener for edit button
editBtn.addEventListener("click", () => {
  const newName = prompt("Enter new name:");
  const newLocation = prompt("Enter new location:");
  const newAge = prompt("Enter new age:");

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
        dob: { ...profile.dob, age: newAge }
      };
    }
    return profile;
  });
  // Update information in localStorage

  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
});

// "SWIPE" right/left
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    //interested
    likedProfiles.unshift(currentProfile); //restrict to only being able to like once, so you don't fill the array with the same profile multiple times
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

// Add the new profiles with the edit button
  likedProfiles.forEach((profile) => {
    const card = document.createElement("div");
    card.classList.add("liked-profile");

    const editButton = document.createElement("button");
    editButton.textContent = "Redigere profil";
    editButton.addEventListener("click", () => editProfile(profile));

    card.innerHTML = `
      <img src="${profile.picture.large}">
      <p>Name: ${profile.name.first} ${profile.name.last}</p>
      <p>Age: ${profile.dob.age}</p>
      <p>Location: ${profile.location.city}, ${profile.location.country}</p>`;
    
    card.appendChild(editButton);
    likedProfileContainer.appendChild(card);
  });
}

// Function to edit liked profile
function editProfile(profile) {
  const newName = prompt("Enter new name:");
  const newLocation = prompt("Enter new location:");
  const newAge = prompt("Enter new age:");

  // Updating profile information
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
