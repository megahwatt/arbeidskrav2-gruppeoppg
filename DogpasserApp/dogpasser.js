const showCardsBtn = document.querySelector("#show-cards-btn").addEventListener("click", showCards);

// fetchAndDisplayRandomUser
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
		randomUser.innerHTML = `<img src="${chosenUser.thumbnail}">
    <p>Navn: ${chosenUser.name}</p>
    <p>Bosted: ${chosenUser.location.city}, ${chosenUser.location.state}</p>`;
	} catch (error) {
		console.log("404", error);
	}
}
fetchAndDisplayRandomUser();

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
