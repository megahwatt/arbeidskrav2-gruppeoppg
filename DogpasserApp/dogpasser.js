// Globale variabler
const showCardsBtn = document.querySelector("#show-cards-btn").addEventListener("click", fetchAndDisplayRandomUser());

const cardContainer = document.querySelector(".card-container");

/*
fetchAndDisplayRandomUser

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
*/

async function fetchAndDisplayRandomUser() {
	try {
		for (let i = 0; i < 10; i++) {
			const cardContainer = createCardContainer();

			// dog
			const dogBreeds = ["labrador", "germanshepherd", "goldenretriever", "beagle", "akita"];
			const randomDogBreed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];

			const dogRequest = await fetch(`https://dog.ceo/api/breed/${randomDogBreed}/images/random`);
			const dogResult = await dogRequest.json();

			const randomDogImg = document.createElement("img");
			randomDogImg.id = "random-dog-img";
			randomDogImg.src = dogResult.message;

			cardContainer.querySelector(".profile-card").appendChild(randomDogImg);

			// human
			const userRequest = await fetch("https://randomuser.me/api/?results=10&nat=us&inc=name,location,picture");
			const { userResults } = await userRequest.json();

			//const chosenUser = userResults;

			const chosenUser = userResults.map(({ name, location, picture }) => ({
				name: name.first,
				location: { city: location.city, state: location.state },
				thumbnail: picture.thumbnail,
			}));

			const randomUser = document.createElement("div");
			randomUser.className = "random-user";

			randomUser.innerHTML = `
                <img src="${chosenUser.picture.thumbnail}">
                <p>Navn: ${chosenUser.name.first}</p>
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

		const deleteBtn = document.createElement("img");
		deleteBtn.src = "assets/delete.png";
		deleteBtn.id = "delete-btn";

		const chatBtn = document.createElement("img");
		chatBtn.src = "assets/chat.png";
		chatBtn.id = "chat-btn";

		profileCard.appendChild(deleteBtn);
		profileCard.appendChild(chatBtn);

		cardContainer.appendChild(profileCard);

		return cardContainer;
	}
}
