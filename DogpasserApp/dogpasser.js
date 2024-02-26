const showCardsBtn = document.querySelector("#show-cards-btn").addEventListener("click", showCards);

let allUsers = fetchUsers();

async function fetchUsers() {
	const request = await fetch("https://randomuser.me/api/?results=500&inc=name,location,picture");
	let { results } = await request.json();

	return results.map(({ name, location, picture }) => ({
		name: name.first,
		location: { city: location.city, state: location.state },
		thumbnail: picture.thumbnail,
	}));
}

function showCards() {
	console.log("Inne i showCards!");
}

//fetchRandomDogImg & vis i HTML
/*
legg til:
getelementybyid random-dog-img = randomdogimg
insert img into html
*/
async function fetchRandomDogImg() {
	const request = await fetch("https://dog.ceo/api/breeds/image/random");
	let result = await request.json();
	return result;
}
