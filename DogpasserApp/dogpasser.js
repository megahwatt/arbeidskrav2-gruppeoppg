// Globale variabler
const cardContainer = document.querySelector(".card-container");

const showCardsBtn = document.querySelector("#show-cards-btn");
showCardsBtn.addEventListener("click", getNewCards);

const chatbox = document.querySelector(".chatbox");

let messages = [];

const breeds = ["labrador", "germanshepherd", "husky", "beagle", "akita"];

let currentUsers = [];

let activeFilter = false;

//fetch en random user, og legg til et hundebilde på hver user
async function fetchRandomUserWithDog() {
	try {
		const request = await fetch("https://randomuser.me/api/?results=1&nat=us&inc=name,location,picture");
		const data = await request.json();
		const user = data.results[0];
		const randomDog = await fetchRandomDog();

		const userWithDog = {
			name: `${user.name.first} ${user.name.last}`,
			location: `${user.location.city}, ${user.location.state}`,
			userImg: user.picture.large,
			dogImg: randomDog.url,
			dogBreed: randomDog.breed,
		};

		currentUsers.unshift(userWithDog);
	} catch (error) {
		console.error("Kunne ikke hente user og randomdog", error);
	}
}

//fetch ett tilfeldig hundebilde, men kun ut ifra 5 valgte raser
async function fetchRandomDog() {
	try {
		const randomDogBreed = breeds[Math.floor(Math.random() * breeds.length)];
		const request = await fetch(`https://dog.ceo/api/breed/${randomDogBreed}/images/random`);
		const response = await request.json();
		const randomDog = { url: response.message, breed: randomDogBreed };

		return randomDog;
	} catch (error) {
		console.error("Kunne ikke hente hundebilde", error);
	}
}

//tømmer users-arrayet hver gang så det bare vises 10 av gangen
function emptyCurrentUsers() {
	currentUsers = [];
}

// "vis 10 nye kort" -- refresher kortene på siden
async function getNewCards() {
	emptyCurrentUsers();
	for (let i = 0; i < 10; i++) {
		await fetchRandomUserWithDog();
	}
	createAndShowCards(currentUsers);
}

// kaller på funksjonen slik at kortene vises når siden lastes
getNewCards();

//slettefunksjon
async function deleteCard(index) {
	currentUsers.splice(index, 1);

	await fetchRandomUserWithDog();

	createAndShowCards(currentUsers);
}

function setupDeleteBtn(index) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = `<img src="assets/delete.png" class="delete-btn" />`;

	deleteBtn.onclick = () => deleteCard(index);
	return deleteBtn;
}

function setupChatBtn(index) {
	const chatBtn = document.createElement("button");
	chatBtn.classList.add("chat-btn");
	chatBtn.innerHTML = `<img src="assets/chat.png" class="chat-btn" />`;

	chatBtn.onclick = () => openChatbox(index);
	return chatBtn;
}

//Lage og vise kort på siden
// setter sammen alle elementene med informasjonen fra de to forrige funksjonene, og lager et kort
function createAndShowCards(users) {
	cardContainer.innerHTML = "";

	users.forEach((user, index) => {
		//lager selve kortet
		const profileCard = document.createElement("div");
		const dogImgContainer = document.createElement("div");
		const userContainer = document.createElement("div");
		const userImgContainer = document.createElement("div");
		const userTxt = document.createElement("div");
		const btnContainer = document.createElement("div");
		const deleteBtn = setupDeleteBtn(index);
		const chatBtn = setupChatBtn(index);

		//legger til klasse på hvert element
		profileCard.classList.add("profile-card");
		profileCard.classList.add(`${user.dogBreed}`); // legger til breed som klasse på kortet
		dogImgContainer.classList.add("dog-img-container");
		userContainer.classList.add("user-container");
		userImgContainer.classList.add("user-img-container");
		userTxt.classList.add("user-txt");
		btnContainer.classList.add("btn-container");

		//legger til innhold i elementene på kortet
		dogImgContainer.innerHTML = `<img src="${user.dogImg}" class="dog-img" />`;
		userImgContainer.innerHTML = `<img src="${user.userImg}" class="user-img-container" />`;
		userTxt.innerHTML = `<p>${user.name}</p> <p>${user.location}</p>`;

		//appender alt til profileCard
		profileCard.append(dogImgContainer, userContainer, btnContainer);
		userContainer.append(userImgContainer, userTxt);

		if (!activeFilter) {
			//legger bare til deleteBtn dersom filteret ikke er aktivt (se filterByBreed*)
			btnContainer.append(deleteBtn);
		}
		btnContainer.append(chatBtn);
		cardContainer.insertBefore(profileCard, cardContainer.firstChild); //endrer koden slik at nytt profileCard lastes inn fra nedre høgre i stede for øvre venstre
	});

	//legger til snakkeboble-funksjonalitet på hver kort
	const dogImages = document.querySelectorAll(".dog-img");
	console.log(dogImages);

	dogImages.forEach((dogImg) => {
		dogImg.addEventListener("click", dogGreets);
	});
}

//filter
const breedFilter = document.querySelector("#breed-filter");

const filterBtn = document.querySelector("#filter-btn");

filterBtn.addEventListener("click", filterByBreed);

function filterByBreed() {
	selectedBreed = breedFilter.value;

	activeFilter = selectedBreed != "all";

	if (activeFilter) {
		//sjekker om filteret er true/aktivt
		filteredUsers = currentUsers.filter((user) => user.dogBreed == selectedBreed);
		createAndShowCards(filteredUsers);
	} else {
		createAndShowCards(currentUsers);
	}
}

//snakkeboble fra hund
function dogGreets(event) {
	const dogGreetings = ["Voff voff", "Grrr!", "Mjau??", "Voff!", "Voff voff voff", "WRAFF!!!"];

	const randomDogGreeting = dogGreetings[Math.floor(Math.random() * dogGreetings.length)];

	const talkBubble = document.createElement("div");
	talkBubble.classList.add("talk-bubble");
	talkBubble.innerHTML = randomDogGreeting;

	const rect = event.target.getBoundingClientRect(); //henter inn informasjon om hvor bildet man trykker på er plassert
	const leftPosition = rect.left + window.scrollX + event.target.width / 4; //sentrerer snakkeboblen på X-aksen
	const topPosition = rect.top + window.scrollY + event.target.height / 4; //sentrerer snakkeboblen på Y-aksen

	//bruker informasjonen som ble kalkulert i forrige trinn
	//til å sette den reelle plasseringen for hver snakkeboble,
	//slik at den blir sentrert uavgengig av hvilket bilde man trykker på
	talkBubble.style.left = `${leftPosition}px`;
	talkBubble.style.top = `${topPosition}px`;

	document.body.appendChild(talkBubble);

	setTimeout(() => {
		document.body.removeChild(talkBubble);
	}, 2000);
}

//chatbox
function hiddenChatbox() {
	chatbox.classList.add("hidden");

	console.log("inne i closeChatbox");
}

function openChatbox(index) {
	chatbox.classList.remove("hidden");

	console.log("inne i openChatbox");

	messages.push(`<b>${currentUsers[index].name}:</b><br />Hei, jeg er en hundeeier!`);
	updateChat();

	const sendBtn = document.querySelector("#send-btn");
	sendBtn.addEventListener("click", sendMessage);

	const closeBtn = document.querySelector("#close-btn");
	closeBtn.addEventListener("click", closeChatbox);
}

function closeChatbox() {
	messages = [];
	chatbox.classList.add("hidden");

	console.log("inne i lukk");
}

function sendMessage() {
	const yourMssg = document.querySelector("#your-mssg");
	messages.push(`<b>Du:</b><br />${yourMssg.value}`);

	yourMssg.value = "";
	console.log(yourMssg.value);
	console.log(messages);
	updateChat();
}

function updateChat() {
	const sentMssgs = document.querySelector(".sent-mssgs");
	sentMssgs.innerHTML = "";

	for (i = 0; i < messages.length; i++) {
		const message = document.createElement("p");
		message.innerHTML += `${messages[i]}<br />`;
		if (i > 0) {
			message.appendChild(setupMssgDelete(i));
		}
		sentMssgs.appendChild(message);
	}
}

function deleteMssg(index) {
	messages.splice(index, 1);
	updateChat();
}

function setupMssgDelete(index) {
	const mssgDelete = document.createElement("button");
	mssgDelete.classList.add("mssg-delete-btn");
	mssgDelete.innerHTML = `<b>SLETT</b>`;

	mssgDelete.onclick = () => deleteMssg(index);
	return mssgDelete;
}
