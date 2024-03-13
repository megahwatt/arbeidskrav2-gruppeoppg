const scoreElement = document.querySelector("#score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const ageElement = document.querySelector(".age");
const profileImgElement = document.querySelector(".profile-card img");
const messageElement = document.querySelector("#message");
const likedProfileContainer = document.querySelector(".liked-profiles-container");

let score = 10;
let likedProfiles = [];
let currentProfile;
let selectedGender;

// Function to update score
function updateScore() {
    score--;
    scoreElement.textContent = score;
    if (score <= 0) {
        const response = prompt("Tom for swipes. Vil du swipe mer? Ja/Nei");
        if (response && response.toLowerCase() === "ja") {
            score = 10;
            scoreElement.textContent = score;
            messageElement.textContent = "";
        }
    }
}

// Fetch random profile
async function fetchRandomUser(gender) {
    try {
        const response = await fetch(
            `https://randomuser.me/api/?results=1&nat=us&inc=name,location,dob,picture,gender&gender=${gender}`
        );
        const data = await response.json();
        const user = data.results[0];
        currentProfile = user;

        nameElement.innerHTML = `<p>Navn: ${user.name.first} ${user.name.last}</p>`;
        ageElement.innerHTML = `<p>Alder: ${user.dob.age}</p>`;
        locationElement.innerHTML = `<p>Bosted: ${user.location.city},<br />${user.location.state}</p>`;
        profileImgElement.src = user.picture.large;

        //Ulik styling på kortet for mann/kvinne
        const profileCard = document.querySelector(".profile-card");
        profileCard.style.backgroundColor = user.gender === "female" ? "pink" : "lightblue"; // Endre fargen her basert på kjønn
    } catch (error) {
        console.error("Error fetching random user:", error);
    }
}


// Function to edit a liked profile
function editProfile(index) {
    console.log("Before editing:", likedProfiles); // Log before editing

    const newName = prompt("Enter new name:");
    const newAge = parseInt(prompt("Enter new age:"));
    const newLocation = prompt("Enter new location:");

    // Check if inputs are valid
    if (newName !== null && !isNaN(newAge) && newLocation !== null) {
        // Update profile in likedProfiles array
        likedProfiles[index].name.first = newName; // Update first name
        likedProfiles[index].name.last = ""; // Clear last name
        likedProfiles[index].dob.age = newAge;
        likedProfiles[index].location.city = newLocation;

        // Update localStorage
        localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));

        // Update liked profiles list on the page
        updateLikedProfilesList();

        console.log("After editing:", likedProfiles); // Log after editing
    } else {
        console.log("Invalid input or canceled."); // Log if inputs are invalid or canceled
    }
}

// Function to delete liked profile
function deleteProfile(index) {
    likedProfiles.splice(index, 1);
    localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
    updateLikedProfilesList();
}

// Initial fetch on page load
window.addEventListener("load", () => {
    fetchRandomUser("");
    updateLikedProfilesList();
});

// Function to save liked profile
function saveLikedProfile() {
    likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || [];

    const profileIndex = likedProfiles.findIndex((profile) => profile.name.first === currentProfile.name.first);

    if (profileIndex !== -1) {
        // Replace existing profile
        likedProfiles.splice(profileIndex, 1, currentProfile);
    } else {
        // Add new profile
        likedProfiles.unshift(currentProfile);
    }

    localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}

// Updates list of liked profiles
function updateLikedProfilesList() {
    likedProfileContainer.innerHTML = "";

    likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || [];

    likedProfiles.forEach((profile, index) => {
        //lager profil-kortet
        const card = document.createElement("div");
        card.innerHTML = `<img src="${profile.picture.large}"> <p>Navn:<br />${profile.name.first} ${profile.name.last}</p><p>Alder: ${profile.dob.age}</p>Bosted:<br />${profile.location.city},<br />${profile.location.state}</p>`;

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

// "SWIPE" piltast høyre/venstre
document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
        // Interested
        if (likedProfiles.length < 10) {
            saveLikedProfile();
            updateLikedProfilesList();
            updateScore();
            fetchRandomUser(selectedGender);
        } else {
            alert("Likte profiler er full. Slett en for å like fler profiler.");
        }
    } else if (e.key === "ArrowLeft") {
        // Not Interested
        updateScore();
        fetchRandomUser(selectedGender);
    }
});

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
