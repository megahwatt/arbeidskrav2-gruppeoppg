// Globale variabler
const cardContainer = document.querySelector(".card-container");

const showCardsBtn = document.querySelector("#show-cards-btn");
showCardsBtn.addEventListener("click", getNewCards);
const breeds = ["labrador", "germanshepherd", "husky", "beagle", "akita"];
let currentUsers = [];

//fetch en random user, og legg til et hundebilde på hver user
async function fetchRandomUserWithDog() {
  try {
    const request = await fetch(
      "https://randomuser.me/api/?results=1&nat=us&inc=name,location,picture"
    );
    const data = await request.json();
    const user = data.results[0];
    const randomDog = await fetchRandomDog();

    const userWithDog = {
      name: `${user.name.last}, ${user.name.first}`,
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
    const request = await fetch(
      `https://dog.ceo/api/breed/${randomDogBreed}/images/random`
    );
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

//Vis 10 nye kort
async function getNewCards() {
  emptyCurrentUsers();
  for (let i = 0; i < 10; i++) {
    await fetchRandomUserWithDog();
  }
  createAndShowCards(currentUsers);
}

getNewCards(); // Viser kort når siden lastes

//Lage og vise kort på siden
function createAndShowCards(users) {
  cardContainer.innerHTML = "";

  users.forEach((user) => {
    //lager selve kortet
    const profileCard = document.createElement("div");
    const dogImgContainer = document.createElement("div");
    const userContainer = document.createElement("div");
    const userImgContainer = document.createElement("div");
    const userTxt = document.createElement("div");
    const btnContainer = document.createElement("div");
    const chatBtn = document.createElement("button");

    //legger til klasse på hvert element
    profileCard.classList.add("profile-card");
    profileCard.classList.add(`${user.dogBreed}`); // legger til breed som klasse på kortet
    dogImgContainer.classList.add("dog-img-container");
    userContainer.classList.add("user-container");
    userImgContainer.classList.add("user-img-container");
    userTxt.classList.add("user-txt");
    btnContainer.classList.add("btn-container");
    chatBtn.classList.add("chat-btn");

    //legger til innhold i elementene på kortet
    dogImgContainer.innerHTML = `<img src="${user.dogImg}" id="dog-img" />`;
    userImgContainer.innerHTML = `<img src="${user.userImg}" class="user-img-container" />`;
    userTxt.innerHTML = `<p>${user.name}</p> <p>${user.location}</p>`;
    chatBtn.innerHTML = `<img src="assets/chat.png" class="chat-btn" />`;

    //appender alt til profileCard
    profileCard.append(dogImgContainer, userContainer, btnContainer);
    userContainer.append(userImgContainer, userTxt);
    btnContainer.append(chatBtn);
    cardContainer.appendChild(profileCard);

    //Slette-knapp - skal kun vises om det IKKE er filter på, dette må kodes
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<img src="assets/delete.png" class="delete-btn" />`;
    btnContainer.append(deleteBtn);
  });
}

//filter
const breedFilter = document.querySelector("#breed-filter");
const filterBtn = document.querySelector("#filter-btn");
filterBtn.addEventListener("click", filterByBreed);

function filterByBreed() {
  selectedBreed = breedFilter.value;

  if (selectedBreed == "all") {
    createAndShowCards(currentUsers);
  } else {
    filteredUsers = currentUsers.filter(
      (user) => user.dogBreed == selectedBreed
    );
    createAndShowCards(filteredUsers);
  }
}
