// Globale variabler
const cardContainer = document.querySelector(".card-container");

const showCardsBtn = document.querySelector("#show-cards-btn");
showCardsBtn.onclick = showCards;

const deleteBtn = document.querySelector(".delete-btn");

// fetchRandomUser -- henter inn 10 brukere
async function fetchRandomUser() {
	try {
		const request = await fetch("https://randomuser.me/api/?results=10&nat=us&inc=picture,name,location");
		const data = await request.json();
		const user = data.results[0];

		return user;
	} catch (error) {
		console.error("Kunne ikke hente users", error);
	}
}

// fetchRandomDogImg -- henter inn bilder av hunder basert på et rase-filter
async function fetchRandomDogImg() {
	const dogBreeds = ["labrador", "germanshepherd", "husky", "beagle", "akita"];
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

// showCards -- viser 10 nye kort hver gang man trykker på knappen, og legger til index-paramteret i kortene
async function showCards() {
	const cardContainer = document.querySelector("card-container");

	cardContainer.innerHTML = "";

	card.forEach((user, index) => {
		const 
	})
	for (let i = 0; i < 10; i++) {
		const card = await createCard(i);
		cardContainer.appendChild(card);
	}
}

//slettefunksjon
function deleteCard(index) {
	card.splice(index, 1);

	showCards();
}

function setupDeleteBtn(index) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = `<img src="assets/delete.png" class="delete-btn" />`;

	deleteBtn.onclick = () => deleteCard(index);
	return deleteBtn;
}

// createCard -- setter sammen alle elementene med informasjonen fra de to forrige funksjonene, og lager et kort
async function createCard(index) {
	for (let i = 0; i < 10; i++) {
		//Henter inn user og hundebilde
		//Bruker Promise.all for at innlastingen av kortene skal gå bittelitt raksere
		const [dogImgUrl, user] = await Promise.all([fetchRandomDogImg(), fetchRandomUser()]);

		//lager selve kortet
		const profileCard = document.createElement("div");
		const dogImgContainer = document.createElement("div");
		const userContainer = document.createElement("div");
		const userImgContainer = document.createElement("div");
		const userTxt = document.createElement("div");
		const btnContainer = document.createElement("div");
		const deleteBtn = setupDeleteBtn(index);
		const chatBtn = document.createElement("button");

		//legger til klasse på hvert element
		profileCard.classList.add("profile-card");
		dogImgContainer.classList.add("dog-img-container");
		userContainer.classList.add("user-container");
		userImgContainer.classList.add("user-img-container");
		userTxt.classList.add("user-txt");
		btnContainer.classList.add("btn-container");
		chatBtn.classList.add("chat-btn");

		//legger til innhold i elementene på kortet
		dogImgContainer.innerHTML = `<img src="${dogImgUrl}" id="dog-img" />`;
		userImgContainer.innerHTML = `<img src="${user.picture.large}" class="user-img-container" />`;
		userTxt.innerHTML = `<p>${user.name.first}</p> <p>${user.location.city}, ${user.location.state}</p>`;
		chatBtn.innerHTML = `<img src="assets/chat.png" class="chat-btn" />`;

		//appender alt til profileCard
		profileCard.append(dogImgContainer, userContainer, btnContainer);
		userContainer.append(userImgContainer, userTxt);
		btnContainer.append(chatBtn, deleteBtn);

		return profileCard;
	}
}

showCards();
