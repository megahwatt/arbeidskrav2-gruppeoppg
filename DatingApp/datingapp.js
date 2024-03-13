const scoreElement = document.querySelector("#score");
const nameElement = document.querySelector(".name");
const locationElement = document.querySelector(".location");
const ageElement = document.querySelector(".age");
const profileImgElement = document.querySelector(".profile-card img");
const editBtn = document.querySelector("#edit-profile");
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
			`https://randomuser.me/api/?results=1&nat=us&inc=name,location,dob,picture&gender=${gender}`
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
		profileCard.style.backgroundColor = user.gender === "female" ? "red" : "blue";
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

/*
//DENNE GJELDER FOR KNAPPEN TIL STOR PROFIL, DEN KNAPPEN ER NÅ FJERNET, SÅ DENNE MÅ KODES OM/FLYTTES
// Event listener for edit button - REDIGERER CURRENT PROFILE - IKKE FERDIG
editBtn.addEventListener("click", () => {
	const newName = prompt("Skriv inn nytt navn:");
	const newAge = parseInt(prompt("Skriv inn ny alder:"));
	const newLocation = prompt("Skriv inn nytt bosted:");

	// Update profile information
	nameElement.textContent = `Navn: ${newName}`;
	ageElement.textContent = `Alder: ${newAge}`;
	locationElement.textContent = `Bosted: ${newLocation}`;

	// Update likedProfiles array  - CURRENT PROFILE LIGGER IKKE I LIKEDPROFILES-ARRAY, SÅ DENNE KODEN VIL IKEK FUNGERE
	likedProfiles = likedProfiles.map((profile) => {
		if (profile.name === nameElement.textContent) {
			return {
				...profile,
				name: newName,
				dob: { ...profile.dob, age: newAge },
				location: newLocation,
			};
		}
		return profile;
	});

	// Update localStorage profile information
	localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
});
*/

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

//Lagre likte profiler
function saveLikedProfile() {
	likedProfiles = JSON.parse(localStorage.getItem("likedProfiles")) || []; //sjekker om det ligger noe lagret fra før

	//legger til profilen under likte profiler, hvis den ikke allerede er lagt til tidligere
	const profileIndex = likedProfiles.findIndex((profile) => profile.name === currentProfile.name);

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
		card.innerHTML = `<img src="${profile.picture.large}"> <p>Navn:<br />${profile.name.first} ${profile.name.last}</p><p>Alder: ${profile.dob.age}</p>Bosted:<br />${profile.location.city},<br />${profile.location.state}</p>`;
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
	const newName = prompt("Skriv inn nytt navn:");
	const newAge = parseInt(prompt("Skriv inn ny alder:"));
	const newLocation = prompt("Skriv inn nytt bosted:");

	// Update profile in likedProfiles array
	likedProfiles[index] = {
		...likedProfiles[index],
		name: newName,
		dob: { ...likedProfiles[index].dob, age: newAge },
		location: newLocation,
	};

	// Update localStorage
	updateLikedProfilesList();
	localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
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
