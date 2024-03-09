const scoreElement = document.getElementById("score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const ageElement = document.querySelector(".age");
const profileImgElement = document.querySelector(".profile-card img");
const editBtn = document.getElementById("edit-profile");
const messageElement = document.getElementById("message");

let score = 10;
let likedProfiles = [];
let currentProfile;
let selectedGender;

// Function to update score - IKKE FERDIG
function updateScore() {
  score--; //her må score hente inn antall likedProfiles fra localStorage og regne ut hvor mange poeng som er igjen.
  scoreElement.textContent = score;
  if (score <= 0) {
    const response = prompt("Tom for swipes. Vil du swipe mer? Ja/Nei");
    if (response && response.toLowerCase() === "ja") {
      score = 10;
      scoreElement.textContent = score;
      messageElement.textContent = "";
    } else {
      //her skal spørsmålet/prompten stilles igjen, helt til brukeren svarer ja
    }
  }
}

// Fetch random profile
async function fetchRandomUser(gender) {
  try {
    const response = await fetch(`https://randomuser.me/api/?gender=${gender}`);
    const data = await response.json();
    const user = data.results[0];
    currentProfile = user;

    nameElement.innerHTML = `${user.name.first} ${user.name.last}`;
    locationElement.innerHTML = `${user.location.city}, ${user.location.country}`;
    ageElement.innerHTML = `Age: ${user.dob.age}`;
    profileImgElement.src = user.picture.large;

    //Ulik styling på kortet for mann/kvinne
    const container = document.querySelector(".container");
    container.style.backgroundColor = user.gender === "female" ? "red" : "blue";
  } catch (error) {
    console.error("Error fetching random user:", error);
  }
}

// Filtrering kjønn
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
  fetchRandomUser(selectedGender);
}

// Event listener for edit button - REDIGERER CURRENT PROFILE - IKKE FERDIG
editBtn.addEventListener("click", () => {
  const newName = prompt("Enter new name:");
  const newLocation = prompt("Enter new location:");
  const newAge = prompt("Enter new age:");

  // Update profile information
  nameElement.textContent = newName;
  locationElement.textContent = newLocation;
  ageElement.textContent = `Age: ${newAge}`;

  // Update likedProfiles array  - CURRENT PROFILE LIGGER IKKE I LIKEDPROFILES-ARRAY, SÅ DENNE KODEN VIL IKEK FUNGERE
  likedProfiles = likedProfiles.map((profile) => {
    if (profile.name === nameElement.textContent) {
      return {
        ...profile,
        name: newName,
        location: newLocation,
        dob: { ...profile.dob, age: newAge },
      };
    }
    return profile;
  });

  // Update localStorage profile information
  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
});

// "SWIPE" piltast høyre/venstre - IKKE FERDIG. MANGLER BEGRENSNING PÅ 10 LIKTE PROFILER
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    // Interested
    saveLikedProfile();
    updateLikedProfilesList();
    updateScore();
    fetchRandomUser(selectedGender);
  } else if (e.key === "ArrowLeft") {
    // Not Interested
    fetchRandomUser(selectedGender);
  }
});

//Lagre likte profiler
function saveLikedProfile() {
  likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || []; //sjekker om det ligger noe lagret fra før

  //legger til profilen under likte profiler, hvis den ikke allerede er lagt til tidligere
  const profileIndex = likedProfiles.findIndex(
    (profile) => profile.name === currentProfile.name
  );

  if (profileIndex !== -1) {
    // Replace existing profile
    likedProfiles.splice(profileIndex, 1, currentProfile);
  } else {
    // Add new profile
    likedProfiles.unshift(currentProfile);
  }

  //oppdaterer likte profiler i localStorage
  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}

// Updates list of liked profiles
function updateLikedProfilesList() {
  likedProfileContainer.innerHTML = "";

  likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || []; //sjekker om det ligger noe lagret fra før

  likedProfiles.forEach((profile, index) => {
    //lager profil-kortet
    const card = document.createElement("div");
    card.innerHTML = `<img src="${profile.picture.large}"> <p> ${profile.name.first} ${profile.name.last},${profile.location.city}, ${profile.location.country} </p> <p class="age">Age: ${profile.dob.age}</p>`;
    card.classList.add(profile.gender);

    //slette-knapp
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteProfile(index);
    });

    //rediger-knapp
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "Edit";
    editBtn.addEventListener("click", function () {
      editProfile(index);
    });

    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    likedProfileContainer.appendChild(card);
  });
}

// Redigere likte profiler (oppdaterer oversikt på siden, array og localstorage) - FUNGERER IKKE
function editProfile(index) {
  const newName = prompt("Enter new name:");
  const newLocation = prompt("Enter new location:");
  const newAge = prompt("Enter new age:");

  // Update profile in likedProfiles array
  likedProfiles[index] = {
    ...likedProfiles[index],
    name: newName,
    location: newLocation,
    dob: { ...likedProfiles[index].dob, age: newAge },
  };

  // Update localStorage
  updateLikedProfilesList();
  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}

// Function to delete liked profile - FUNGERER IKKE
function deleteProfile(index) {
  likedProfiles.splice(index, 1);
  updateLikedProfilesList();
  localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}

// Initial fetch on page load
window.addEventListener("load", () => {
  fetchRandomUser("");
  updateLikedProfilesList();
  updateScore();
});
