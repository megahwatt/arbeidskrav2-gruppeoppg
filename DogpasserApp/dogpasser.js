// Globale variabler
/*
const showCardsBtn = document.getElementById("show-cards-btn").addEventListener("click", fetchAndDisplayRandomUser);

const cardContainer = document.querySelector(".card-container");
*/

// kopier og lag nye card containers --- må fikses, ikke ferdig
function createCardContainer() {
	for (let i = 0; i < 10; i++) {
		const cardContainer = document.createElement("div");
		cardContainer.className = "card-container";

		const profileCard = document.createElement("div");
		profileCard.className = "profile-card";

		const randomUser = document.createElement("div");
		randomUser.className = "random-user";

		const deleteBtn = document.createElement("img");
		deleteBtn.src = "assets/delete.png";
		deleteBtn.id = "delete-btn";

		const chatBtn = document.createElement("img");
		chatBtn.src = "assets/chat.png";
		chatBtn.id = "chat-btn";

		profileCard.appendChild(deleteBtn);
		profileCard.appendChild(chatBtn);

		cardContainer.appendChild(profileCard);
		cardContainer.appendChild(randomUser);
	}
}
createCardContainer();

// denne virker, og setter inn bildet på rett plass
// må implementeres i en loop
async function fetchRandomDogImg() {
	const dogBreeds = ["labrador", "germanshepherd", "husky", "beagle", "akita"];

	let randomDogBreed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
	try {
		const dogRequest = await fetch(`https://dog.ceo/api/breed/${randomDogBreed}/images/random`);
		const response = await dogRequest.json();

		document.getElementById("random-dog-img").src = response.message;
	} catch (error) {
		console.error("Dog 404", error);
	}
}
fetchRandomDogImg();

// denne virker, og setter inn all informasjon på rett plass
// må implementeres i en loop
async function fetchRandomUsers() {
	try {
		const humanRequest = await fetch("https://randomuser.me/api/?results=10&nat=us&inc=name,location,picture");
		const { results } = await humanRequest.json();

		const chosenUsers = results.map(({ name, location, picture }) => ({
			name: name.first,
			location: { city: location.city, state: location.state },
			thumbnail: picture.thumbnail,
		}));

		const oneUser = chosenUsers[Math.floor(Math.random() * results.length)];

		const randomUser = document.querySelector(".random-user");

		randomUser.innerHTML = `
				<img src="${oneUser.thumbnail}">
                <p>Navn: ${oneUser.name.first}</p>
                <p>Bosted: ${oneUser.location.city}, ${oneUser.location.state}</p>`;
	} catch (error) {
		console.log("Human 404", error);
	}
}
fetchRandomUsers();

/*
fetchAndDisplayRandomUser

Jeg har kommentert ut all denne koden fordi jeg har rota det heeelt til og ingenting virker

Fyller kortene fra createCardContainer
med informasjon innhentet fra APIene.
Den første delen innhenter 10 unike brukere,
og legger disse i en DIV.
Den andre delen innhenter et tilfeldig hundebilde,
basert på et filter av fem raser som vi har definert først i funksjonen.
Bildet blir lagt i en DIV,
og begge de nye elementene blir dytta inn i DOM.
Loopen sørger for at vi får 10 nye HTML-elementer
hver gang vi fornyer siden.
Ved å legge bruker- og hunde-APIene inne i en
FOR-loop garanterer vi at hver bruker-profil er unik,
i stedet for at vi får 10 kopier av samme kort.




fetchAndDisplayRandomUser();

async function fetchAndDisplayRandomUser() {
	const dogBreeds = ["labrador", "germanshepherd", "husky", "beagle", "akita"];

	let randomDogBreed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
	try {
		for (let i = 0; i < 10; i++) {
			const cardContainer = createCardContainer();

			// randomDogImg
			const dogRequest = await fetch(`https://dog.ceo/api/breed/${randomDogBreed}/images/random`);
			const response = await dogRequest.json();

			const randomDogImg = document.createElement("img");
			randomDogImg.id = "random-dog-img";
			randomDogImg.src = dogRequest.message;

			document.getElementById("random-dog-img").appendChild(randomDogImg);

			// randomuser
			const humanRequest = await fetch("https://randomuser.me/api/?results=10&nat=us&inc=name,location,picture");
			const { results } = await humanRequest.json();

			const chosenUsers = results.map(({ name, location, picture }) => ({
				name: name.first,
				location: { city: location.city, state: location.state },
				thumbnail: picture.thumbnail,
			}));

			const oneUser = chosenUsers[Math.floor(Math.random() * results.length)];

			const randomUser = document.createElement("div");
			randomUser.className = "random-user";

			randomUser.innerHTML = `
				<img src="${oneUser[i].thumbnail}">
                <p>Navn: ${oneUser[i].name.first}</p>
                <p>Bosted: ${oneUser[i].location.city}, ${oneUser[i].location.state}</p>`;

			cardContainer.querySelector(".profile-card").appendChild(randomUser);

			document.body.appendChild(cardContainer);
		}
	} catch (error) {
		console.log("All 404", error);
	}
	function createCardContainer() {
		const cardContainer = document.createElement("div");
		cardContainer.className = "card-container";

		const profileCard = document.createElement("div");
		profileCard.className = "profile-card";

		const deleteBtn = document.createElement("img");
		deleteBtn.src = "assets/delete.png";
		deleteBtn.id = "delete-btn";

		const chatBtn = document.createElement("img");
		chatBtn.src = "assets/chat.png";
		chatBtn.id = "chat-btn";

		profileCard.appendChild(deleteBtn);
		profileCard.appendChild(chatBtn);

		cardContainer.appendChild(profileCard);
	}
}
*/
