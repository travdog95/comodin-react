import Player from "./player";

export default class Game {
  constructor(settings) {
    this.id = this.newId;
    this.settings = settings;
    this.players = [];
    this.turn = "";
    this.turnOrder = [];

    //this.startNewGame();
  }

  get newId() {
    return Date.now();
  }

  get numPlayers() {
    return this.playerNames.length;
  }

  async startNewGame() {
    //Display paddles
    this.settings.playerNames.forEach((playerName, playerIndex) => {
      const player = new Player(playerIndex + 1, playerName, this.settings);

      player.init();
      //update turn order
      this.turnOrder.push(player.id);

      this.players.push(player);

      // //Create paddle
      // player.paddleElement = UI.createPaddle(player);

      // //Update data-track & data-position data attributes
      // player.updateTrackAttributes();

      // //Add paddle to board
      // UI.gameBoardElement.append(player.paddleElement);

      // //Create deck deckContainer
      // const deckContainer = UI.createDeckContainer(player);

      // //Add player's deck to card table
      // UI.cardTableElement.append(deckContainer);

      // //Load player marbles into start positions
      // UI.loadMarblesToStartPositions(player);

      // //if first player, rotate paddle 180
      // if (playerIndex === 0) {
      //   player.paddleElement.classList.add("rotate-180");
      // }

      // //Deal hand
      // player.dealHand(this.settings.maxCardsInHand);
    });
  }
}
