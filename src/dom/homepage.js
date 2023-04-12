const startGamePage = document.querySelector(".start-game-container");
const startGame = document.querySelector(".homepage-start-game");
const placeShipsPage = document.querySelector(".place-ships-container");
const placeShipsGameboard = document.querySelector(".place-ships-gameboard");
startGame.addEventListener("click", () => {
  startGamePage.classList.remove("active");
  placeShipsPage.classList.add("active");
  placeShipsGameboard.classList.add("active");
});
