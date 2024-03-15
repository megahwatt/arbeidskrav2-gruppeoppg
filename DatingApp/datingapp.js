// Globale variabler -- Camilla
const scoreElement = document.querySelector("#score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const ageElement = document.querySelector(".age");
const profileImgElement = document.querySelector(".profile-card img");
const likedProfileContainer = document.querySelector(".liked-profiles-container");

let score = 10;
let likedProfiles = [];
let currentProfile;
let selectedGender;

// Fetch random profile -- Camilla
async function fetchRandomUser(gender) {
	try {
		const response = await fetch(
			`https://randomuser.me/api/?results=1&nat=us&inc=name,location,dob,picture,gender&gender=${gender}`
		);
		const data = await response.json();
		const user = data.results[0];
		currentProfile = user;

		nameElement.innerHTML = `<p>Navn: ${user.name.first}<br />${user.name.last}</p>`;
		ageElement.innerHTML = `<p>Alder: ${user.dob.age}</p>`;
		locationElement.innerHTML = `<p>Bosted: ${user.location.city},<br />${user.location.state}</p>`;
		profileImgElement.src = user.picture.large;

		//Ulik styling på kortet for mann/kvinne
		const profileCard = document.querySelector(".profile-card");
		profileCard.style.backgroundColor = user.gender === "female" ? "red" : "blue";
	} catch (error) {
		console.error("Error fetching random user:", error);
	}
}

// alle
function updateScore() {
	if (score > 0) {
		score--;
		scoreElement.textContent = score;
	}
	if (score <= 0) {
		let response = "";
		while (response.toLowerCase() !== "ja") {
			response = prompt("Tom for swipes. Vil du swipe mer? Ja/Nei");
		}
		score = 10;
		scoreElement.textContent = score;
	}
}

document.addEventListener("keydown", function (e) {
	if (score > 0 && score <= 10) {
		if (e.key === "ArrowRight") {
			if (likedProfiles.length < 10) {
				saveLikedProfile();
				updateLikedProfilesList();
				updateScore();
				fetchRandomUser(selectedGender);
			} else {
				alert("Likte profiler er full. Slett en for å like fler profiler.");
			}
		} else if (e.key === "ArrowLeft") {
			updateScore();
			fetchRandomUser(selectedGender);
		}
	} else {
		alert("Score tom!");
		updateScore();
	}
});

// Filtrering kjønn -- Camilla
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

// Function to edit a liked profile -- Lallo
function editProfile(index) {
	console.log("Før redigering:", likedProfiles); // Logg før redigering

	const newName = prompt("Skriv inn nytt navn:");
	const newAge = parseInt(prompt("Skriv inn ny alder:"));
	const newLocationCity = prompt("Skriv inn ny by:");
	const newLocationState = prompt("Skriv inn ny stat:");

	// Sjekk om inndataene er gyldige
	if (newName !== null && !isNaN(newAge) && newLocationCity !== null && newLocationState !== null) {
		// Oppdater profilen i likedProfiles-arrayet
		likedProfiles[index].name.first = newName; // Oppdater fornavnet
		likedProfiles[index].name.last = ""; // Tøm etternavn
		likedProfiles[index].dob.age = newAge;
		likedProfiles[index].location.city = newLocationCity;
		likedProfiles[index].location.state = "";

		// Oppdater localStorage
		localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));

		// Oppdater listen over likte profiler på siden
		updateLikedProfilesList();

		console.log("Etter redigering:", likedProfiles); // Logg etter redigering
	} else {
		console.log("Ugyldig inndata eller avbrutt."); // Logg hvis inndataene er ugyldige eller avbrutt
	}
}

// Function to delete liked profile -- Susanne
function deleteProfile(index) {
	likedProfiles.splice(index, 1);
	localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
	updateLikedProfilesList();
}

// Initial fetch on page load -- lallo
window.addEventListener("load", () => {
	fetchRandomUser("");
	updateLikedProfilesList();
});

// Function to save liked profile -- Lallo, Camilla
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

// Updates list of liked profiles -- Lallo, Camilla, Susanne
function updateLikedProfilesList() {
	likedProfileContainer.innerHTML = "";

	likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || [];

	likedProfiles.forEach((profile, index) => {
		//lager profil-kortet
		const card = document.createElement("div");
		card.innerHTML = `<img src="${profile.picture.large}"> <p>Navn:<br />${profile.name.first}<br />${profile.name.last}</p><p>Alder: ${profile.dob.age}</p>Bosted:<br />${profile.location.city},<br />${profile.location.state}</p>`;

		//slette-knapp
		const deleteBtn = document.createElement("button");
		deleteBtn.innerHTML = "Slett";
		deleteBtn.addEventListener("click", function () {
			deleteProfile(index);
		});

		//rediger-knapp
		const editBtn = document.createElement("button");
		editBtn.innerHTML = "Rediger";
		editBtn.addEventListener("click", function () {
			editProfile(index);
		});

		card.appendChild(editBtn);
		card.appendChild(deleteBtn);
		likedProfileContainer.appendChild(card);
	});
}
