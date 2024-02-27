//fetch EN random user med bilde, navn og lokasjon

async function fetchRandomUser() {
  try {
    const request = await fetch(
      "https://randomuser.me/api/?inc=picture,name,location"
    );
    const response = await request.json();
    let randomUser = response.results;

    return randomUser;
  } catch (error) {
    console.error("Kunne ikke hente users", error);
  }
}

//fetch ETT tilfeldig hundebilde, men kun ut ifra 5 valgte raser

const dogBreeds = ["havanese", "dingo", "pitbull", "akita", "eskimo"];

async function fetchRandomDogImg() {
  try {
    let randomDogBreed =
      dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
    const request = await fetch(
      `https://dog.ceo/api/breed/${randomDogBreed}/images/random`
    );
    const response = await request.json();
    let randomDogImg = response.message;

    return randomDogImg;
  } catch (error) {
    console.error("Kunne ikke hente hundebilde", error);
  }
}

// Globale variabler
const cardContainer = document.querySelector("#card-container");
const showCardsBtn = document
  .querySelector("#show-cards-btn")
  .addEventListener("click", createAndShowCards());

//Lage og vise kort på siden
async function createAndShowCards() {
  cardContainer.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    let dogImgUrl = await fetchRandomDogImg();
    let user = await fetchRandomUser();

    let profileCard = document.createElement("div");
    profileCard.innerHTML = `<img src="${dogImgUrl}" width="200px"/>
    <img src="${user[0].picture.large}" width="100px"/>
      <p>Navn: ${(user[0].name.first, user[0].name.last)}</p>
      <p>Bosted: ${user[0].location.city}</p>`;
    profileCard.classList.add("profile-card");
    cardContainer.append(profileCard);
  }
}
