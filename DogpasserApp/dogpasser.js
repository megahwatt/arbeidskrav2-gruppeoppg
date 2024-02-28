// Globale variabler
const cardContainer = document.querySelector(".card-container");
const showCardsBtn = document.querySelector("#show-cards-btn");
showCardsBtn.onclick = createAndShowCards;

//fetch en random user med bilde, navn og lokasjon
async function fetchRandomUser() {
  try {
    const request = await fetch(
      "https://randomuser.me/api/?nat=us&inc=picture,name,location"
    );
    const data = await request.json();
    const user = data.results[0];
    console.log("Inne i fetchRandomUser", user);

    return user;
  } catch (error) {
    console.error("Kunne ikke hente users", error);
  }
}

async function pageLoad() {
  await fetchRandomDogImg();
  await fetchRandomUser();
  await createAndShowCards();
}

pageLoad();

//fetch ett tilfeldig hundebilde, men kun ut ifra 5 valgte raser
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

//Lage og vise kort på siden.
//Denne funksjonen må deles opp i mindre ansvarsområder, men da må vi nok inn med parametere, hufff.
async function createAndShowCards() {
  cardContainer.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    //henter inn user og dog
    const dogImgUrl = await fetchRandomDogImg();
    const user = await fetchRandomUser();

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
    dogImgContainer.classList.add("dog-img-container");
    userContainer.classList.add("user-container");
    userImgContainer.classList.add("user-img-container");
    userTxt.classList.add("user-txt");
    btnContainer.classList.add("btn-container");
    deleteBtn.classList.add("delete-btn");
    chatBtn.classList.add("chat-btn");

    //legger til innhold i elementene på kortet
    dogImgContainer.innerHTML = `<img src="${dogImgUrl}" id="dog-img">`;
    userImgContainer.innerHTML = `<img src="${user.picture.large}" class="user-img-container" />`;
    userTxt.innerHTML = `<p>${user.name.first} ${user.name.last}, </p> <p>${user.location.city}</p>`;
    deleteBtn.innerHTML = "Slett";
    chatBtn.innerHTML = "Chat";

    //appender alt
    cardContainer.append(profileCard);
    profileCard.append(dogImgContainer, userContainer, btnContainer);
    userContainer.append(userImgContainer, userTxt);
    btnContainer.append(chatBtn, deleteBtn);
  }
}
