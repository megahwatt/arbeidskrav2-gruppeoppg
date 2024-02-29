// Globale variabler
const cardContainer = document.querySelector(".card-container");
const showCardsBtn = document.querySelector("#show-cards-btn");
showCardsBtn.onclick = showCards;
const breedFilter = document.querySelector("#breed-filter");
const filterBtn = document.querySelector("#filter-btn");
filterBtn.onclick = filterByBreed;

//fetch en random user med bilde, navn og lokasjon
async function fetchRandomUser() {
  try {
    const request = await fetch(
      "https://randomuser.me/api/?results=10&nat=us&inc=picture,name,location"
    );
    const data = await request.json();
    const user = data.results[0];

    return user;
  } catch (error) {
    console.error("Kunne ikke hente users", error);
  }
}

//fetch ett tilfeldig hundebilde, men kun ut ifra 5 valgte raser
async function fetchRandomDogImg() {
  const dogBreeds = ["labrador", "germanshepherd", "husky", "beagle", "akita"];
  try {
    let randomDogBreed =
      dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
    const request = await fetch(
      `https://dog.ceo/api/breed/${randomDogBreed}/images/random`
    );
    const response = await request.json();
    let randomDogImg = { url: response.message, breed: randomDogBreed }; //legger til breed som attributt

    return randomDogImg;
  } catch (error) {
    console.error("Kunne ikke hente hundebilde", error);
  }
}

// Viser kort når siden lastes
showCards();

//Lage kort
async function createCard() {
  for (let i = 0; i < 10; i++) {
    //Henter inn user og hundebilde
    //Bruker Promise.all for at innlastingen av kortene skal gå bittelitt raksere
    const [dogImgUrl, user] = await Promise.all([
      fetchRandomDogImg(),
      fetchRandomUser(),
    ]);

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
    profileCard.classList.add(`${dogImgUrl.breed.toLowerCase()}`); // legger til breed som klasse på kortet
    dogImgContainer.classList.add("dog-img-container");
    userContainer.classList.add("user-container");
    userImgContainer.classList.add("user-img-container");
    userTxt.classList.add("user-txt");
    btnContainer.classList.add("btn-container");
    deleteBtn.classList.add("delete-btn");
    chatBtn.classList.add("chat-btn");

    //legger til innhold i elementene på kortet
    dogImgContainer.innerHTML = `<img src="${dogImgUrl.url}" id="dog-img" />`;
    userImgContainer.innerHTML = `<img src="${user.picture.large}" class="user-img-container" />`;
    userTxt.innerHTML = `<p>${user.name.first}</p> <p>${user.location.city}, ${user.location.state}</p>`;
    deleteBtn.innerHTML = `<img src="assets/delete.png" class="delete-btn" />`;
    chatBtn.innerHTML = `<img src="assets/chat.png" class="chat-btn" />`;

    //appender alt til profileCard
    profileCard.append(dogImgContainer, userContainer, btnContainer);
    userContainer.append(userImgContainer, userTxt);
    btnContainer.append(chatBtn, deleteBtn);

    return profileCard;
  }
}

// Viser kortene på siden
async function showCards() {
  cardContainer.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const card = await createCard();
    cardContainer.appendChild(card);
  }
}

//filterfunksjon - ikke ferdig

function filterByBreed() {
  const selectedBreed = breedFilter.value;

  if (dogImgUrl.includes(selectedBreed)) {
  }
}
