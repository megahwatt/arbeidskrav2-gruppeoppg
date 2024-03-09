const scoreElement = document.getElementById("score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const ageElement = document.querySelector(".age");
const profileImgElement = document.querySelector(".profile-card img");
const editBtn = document.getElementById("edit-profile");
const messageElement = document.getElementById("message");
const notInterestedBtn = document.getElementById("not-interested");
const interestedBtn = document.getElementById("interested");

let score = 10;
let likedProfiles = [];
let currentProfile;
let selectedGender;

// Function to update score
function updateScore() {
    score--;
    scoreElement.textContent = score;
    if (score <= 0) {
        const response = prompt("Out of swipes! Would you like to swipe more? Yes/No");
        if (response && response.toLowerCase() === "yes") {
            score = 10;
            scoreElement.textContent = score;
            messageElement.textContent = "";
            notInterestedBtn.disabled = false;
            interestedBtn.disabled = false;
        } else {
            messageElement.textContent = "Come back later when you're ready to swipe more!";
            notInterestedBtn.disabled = true;
            interestedBtn.disabled = true;
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

        const container = document.querySelector(".container");
        container.style.backgroundColor = user.gender === "female" ? "red" : "blue";
    } catch (error) {
        console.error("Error fetching random user:", error);
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
    fetchRandomUser(selectedGender);
}

// Event listener for edit button
editBtn.addEventListener('click', () => {
    const newName = prompt("Enter new name:");
    const newLocation = prompt("Enter new location:");
    const newAge = prompt("Enter new age:");

    // Update profile information
    nameElement.textContent = newName;
    locationElement.textContent = newLocation;
    ageElement.textContent = `Age: ${newAge}`;

    // Update likedProfiles array
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

    // Update localStorage profile information
    localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
});

// "SWIPE" right/left
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

// Function to save liked profile
function saveLikedProfile() {
    const profileIndex = likedProfiles.findIndex(profile => profile.name === currentProfile.name);

    if (profileIndex !== -1) {
        // Replace existing profile
        likedProfiles.splice(profileIndex, 1, currentProfile);
    } else {
        // Add new profile
        likedProfiles.unshift(currentProfile);
    }
}

// Updates list of liked profiles
function updateLikedProfilesList() {
    const likedProfileContainer = document.querySelector(".liked-profiles-container");
    likedProfileContainer.innerHTML = "";

    likedProfiles.forEach((profile, index) => {
        const card = document.createElement("div");
        card.innerHTML = `<img src="${profile.picture.large}"> <h2>${profile.name.first} ${profile.name.last}</h2> <p>${profile.location.city}, ${profile.location.country}</p> <p class="age">Age: ${profile.dob.age}</p>`;
        card.classList.add(profile.gender); 

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteProfile(index);
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function () {
            editProfile(index);
        });

        card.appendChild(editBtn);
        card.appendChild(deleteBtn);
        likedProfileContainer.appendChild(card);
    });
}

// Function to edit liked profile
function editProfile(index) {
    const newName = prompt("Enter new name:");
    const newLocation = prompt("Enter new location:");
    const newAge = prompt("Enter new age:");

    // Update profile in likedProfiles array
    likedProfiles[index] = {
        ...likedProfiles[index],
        name: newName,
        location: newLocation,
        dob: { ...likedProfiles[index].dob, age: newAge }
    };

    // Update localStorage
    updateLikedProfilesList();
    localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}


// Function to delete liked profile
function deleteProfile(index) {
    likedProfiles.splice(index, 1);
    updateLikedProfilesList();
    localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
}

// Initial fetch on page load
window.addEventListener("load", () => {
    fetchRandomUser("");
});
