//fetch EN random user med bilde, navn og lokasjon. Vurdere om vi heller bør hente 10 stk samtidig her?

async function fetchRandomUser() {
	try {
		const request = await fetch("https://randomuser.me/api/?nat=us&inc=picture,name,location");
		let { results } = await request.json();
		return results;
	} catch (error) {
		console.error("Kunne ikke hente users", error);
	}
}

//fetch ETT tilfeldig hundebilde, men kun ut ifra 5 valgte raser

const dogBreeds = ["havanese", "dingo", "pitbull", "akita", "eskimo"];

async function fetchRandomDogImg() {
	try {
		let randomDogBreed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
		const request = await fetch(`https://dog.ceo/api/breed/${randomDogBreed}/images/random`);
		const response = await request.json();
		let randomDogImg = response.message;

		return randomDogImg;
	} catch (error) {
		console.error("Kunne ikke hente hundebilde", error);
	}
}

// Globale variabler
const cardContainer = document.querySelector("#card-container");

//Lage og vise kort på siden. Her har jeg appendet alt inn i profile-card, så det må vi endre på slik at de appender til hver sin div, slik det er delt inn i HTML-koden.
async function createAndShowCards() {
	cardContainer.innerHTML = "";

	for (let i = 0; i < 10; i++) {
		let dogImgUrl = await fetchRandomDogImg();
		let user = await fetchRandomUser();

		let profileCard = document.createElement("div");
		profileCard.innerHTML = `<img src="${dogImgUrl}" width="200px"/>
    <img src="${user[0].picture.large}" width="100px"/>
      <p>Navn: ${user[0].name.first + user[0].name.last}</p>
      <p>Bosted: ${user[0].location.city}</p>`;
		profileCard.classList.add("profile-card");
		cardContainer.append(profileCard); //denne må endres til
	}
}
const showCardsBtn = document.querySelector("#show-cards-btn").addEventListener("click", createAndShowCards());

/*
 // showCardsBtn --- Vis 10 nye kort --- ikke ferdig
const showCardsBtn = document.querySelector("#show-cards-btn").addEventListener("click", showCards);

function showCards() {
	console.log("Inne i showCards!");
}

// fetchAndDisplayRandomUser --- henter inn brukere fra API og viser dem i nederste delen av kortet
async function fetchAndDisplayRandomUser() {
	try {
		const request = await fetch("https://randomuser.me/api/?results=500&nat=us&inc=name,location,picture");
		const { results } = await request.json();

		const users = results.map(({ name, location, picture }) => ({
			name: name.first,
			location: { city: location.city, state: location.state },
			thumbnail: picture.thumbnail,
		}));

		const chosenUser = users[Math.floor(Math.random() * users.length)];
		const randomUser = document.querySelector(".random-user");
		randomUser.innerHTML = `
        <img src="${chosenUser.thumbnail}">
        <p>Navn: ${chosenUser.name}</p>
        <p>Bosted: ${chosenUser.location.city}, ${chosenUser.location.state}</p>`;
	} catch (error) {
		console.log("404", error);
	}
}

fetchAndDisplayRandomUser();

// fetchRandomDogImg --- henter inn et tilfeldig bilde fra API og viser den i øverste delen av kortet
async function fetchRandomDogImg() {
	try {
		const request = await fetch("https://dog.ceo/api/breeds/image/random");
		const dogImg = await request.json();

		document.getElementById("random-dog-img").src = dogImg.message;
	} catch (error) {
		console.log("404", error);
	}
}

fetchRandomDogImg();
  */
