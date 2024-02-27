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

// fetchRandomDogImg --- henter inn et tilfeldig bilde fra API og viser den i øverste delen av k ortet
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
