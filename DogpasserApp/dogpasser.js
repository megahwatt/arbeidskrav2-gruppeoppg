// Globale variabler
const cardContainer = document.querySelector(".card-container");
const showCardsBtn = document.querySelector("#show-cards-btn");

showCardsBtn.addEventListener("click", showCards);

//filter-knapper
const labradorBtn = document
  .querySelector("#labrador-btn")
  .addEventListener("click", function () {
    filterByBreed("labrador");
  });
const germanshepherdBtn = document
  .querySelector("#germanshepherd-btn")
  .addEventListener("click", function () {
    filterByBreed("germanshepherd");
  });
const huskyBtn = document
  .querySelector("#husky-btn")
  .addEventListener("click", function () {
    filterByBreed("husky");
  });
const beagleBtn = document
  .querySelector("#beagle-btn")
  .addEventListener("click", function () {
    filterByBreed("beagle");
  });
const akitaBtn = document
  .querySelector("#akita-btn")
  .addEventListener("click", function () {
    filterByBreed("akita");
  });
const showAllBtn = document
  .querySelector("#show-all-btn")
  .addEventListener("click", function () {
    showAll();
  });

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
    return userWithDog;
  } catch (error) {
    console.error("Kunne ikke hente user og randomdog", error);
  }
}

//fetch ett tilfeldig hundebilde, men kun ut ifra 5 valgte raser
async function fetchRandomDog() {
  const dogBreeds = ["labrador", "germanshepherd", "husky", "beagle", "akita"];
  try {
    const randomDogBreed =
      dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
    const request = await fetch(
      `https://dog.ceo/api/breed/${randomDogBreed}/images/random`
    );
    const response = await request.json();
    const randomDog = { url: response.message, breed: randomDogBreed }; //legger til breed som attributt

    return randomDog;
  } catch (error) {
    console.error("Kunne ikke hente hundebilde", error);
  }
}

//Lage kort
async function createCard() {
  //Henter inn user og hundebilde
  //Bruker Promise.all for at innlastingen av kortene skal gå bittelitt raksere
  const user = await fetchRandomUserWithDog();
  console.log(user);

  //lager selve kortet
  const profileCard = document.createElement("div");
  const dogImgContainer = document.createElement("div");
  const userContainer = document.createElement("div");
  const userImgContainer = document.createElement("div");
  const userTxt = document.createElement("div");
  const btnContainer = document.createElement("div");
  const deleteBtn = document.createElement("button");
  const chatBtn = document.createElement("button");

  //legger til klasse på hvert element
  profileCard.classList.add("profile-card");
  profileCard.classList.add(`${user.dogBreed}`); // legger til breed som klasse på kortet
  dogImgContainer.classList.add("dog-img-container");
  userContainer.classList.add("user-container");
  userImgContainer.classList.add("user-img-container");
  userTxt.classList.add("user-txt");
  btnContainer.classList.add("btn-container");
  deleteBtn.classList.add("delete-btn");
  chatBtn.classList.add("chat-btn");

  //legger til innhold i elementene på kortet
  dogImgContainer.innerHTML = `<img src="${user.dogImg}" id="dog-img" />`;
  userImgContainer.innerHTML = `<img src="${user.userImg}" class="user-img-container" />`;
  userTxt.innerHTML = `<p>${user.name}</p> <p>${user.location}</p>`;
  deleteBtn.innerHTML = `<img src="assets/delete.png" class="delete-btn" />`;
  chatBtn.innerHTML = `<img src="assets/chat.png" class="chat-btn" />`;

  //appender alt til profileCard
  profileCard.append(dogImgContainer, userContainer, btnContainer);
  userContainer.append(userImgContainer, userTxt);
  btnContainer.append(chatBtn, deleteBtn);

  return profileCard;
}

// Viser kortene på siden
async function showCards() {
  cardContainer.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const card = await createCard();
    cardContainer.appendChild(card);
  }
}

showCards(); // Viser kort når siden lastes

//filterfunksjon

function filterByBreed(breed) {
  const cards = document.querySelectorAll(".profile-card");
  const cardsArray = Array.from(cards); // Gjør HTML-element-samlingen til array
  cardsArray.forEach((card) => {
    if (card.classList.contains(breed)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
      //også legge inn hidden på sletteknappen?
    }
  });
}

function showAll() {
  const cards = document.querySelectorAll(".profile-card");
  const cardsArray = Array.from(cards); // Gjør HTML-element-samlingen til array
  cardsArray.forEach((card) => {
    card.classList.remove("hidden");
  });
}
