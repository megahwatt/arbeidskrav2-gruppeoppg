const showCardsBtn = document.querySelector("#show-cards-btn").addEventListener("click", showCards);

let allUsers = fetchUsers();

async function fetchUsers() {
	const request = await fetch("https://randomuser.me/api/?results=500"); //fetcher 500 users
	let result = await request.json();
	return result;
}

async function fetchRandomDogImg() {
	const request = await fetch("https://dog.ceo/api/breeds/image/random");
	let result = await request.json();
	return result;
}

function showCards() {
	console.log("Inne i showCards!");
}
