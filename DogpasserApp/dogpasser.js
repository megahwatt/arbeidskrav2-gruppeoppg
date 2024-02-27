async function fetchAndDisplayRandomUser() {
	try {
		const request = await fetch("https://randomuser.me/api/?results=10&nat=us&inc=name,location,picture");
		const { results } = await request.json();

		const user = results.map(({ name, location, picture }) => ({
			name: name.first,
			location: { city: location.city, state: location.state },
			thumbnail: picture.thumbnail,
		}));

		for (let i = 0; i < 10; i++) {
			const cardContainer = createCardContainer();

			const chosenUser = user[Math.floor(Math.random() * user.length)];

			const randomUser = document.createElement("div");
			randomUser.className = "random-user";

			randomUser.innerHTML = `
            <img src="${chosenUser.thumbnail}">
            <p>Navn: ${chosenUser.name}</p>
            <p>Bosted: ${chosenUser.location.city}, ${chosenUser.location.state}</p>`;

			cardContainer.querySelector(".profile-card").appendChild(randomUser);

			document.body.appendChild(cardContainer);
		}
	} catch (error) {
		console.log("404", error);
	}

	function createCardContainer() {
		const cardContainer = document.createElement("div");
		cardContainer.className = "card-container";

		const profileCard = document.createElement("div");
		profileCard.className = "profile-card";

		const randomDogImg = document.createElement("img");
		randomDogImg.id = "random-dog-img";

		const randomUser = document.createElement("div");
		randomUser.className = "random-user";

		const deleteBtn = document.createElement("img");
		deleteBtn.src = "assets/delete.png";
		deleteBtn.id = "delete-btn";

		const chatBtn = document.createElement("img");
		chatBtn.src = "assets/chat.png";
		chatBtn.id = "chat-btn";

		profileCard.appendChild(randomDogImg);
		profileCard.appendChild(randomUser);
		profileCard.appendChild(deleteBtn);
		profileCard.appendChild(chatBtn);

		cardContainer.appendChild(profileCard);

		return cardContainer;
	}
}

fetchAndDisplayRandomUser();

/* CAMILLA'S ORG KODE
 const showCardsBtn = document.querySelector("#show-cards-btn").addEventListener("click", createAndShowCards());

// Globale variabler
const cardContainer = document.querySelector(".card-container");
*/

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


--hundebilder--

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

CAMILLA'S ORG KODE
//fetch ETT tilfeldig hundebilde, men kun ut ifra 5 valgte raser

const dogBreeds = ["labrador", "germanshepherd", "goldenretriever", "beagle", "bulldog"];

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
  */
