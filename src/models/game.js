export default class Game {
  constructor(players, gameBoard, settings) {
    this.id = this.newId;
    this.settings = settings;
    this.players = players;
    this.turnOrder = this.setTurnOrder;
    this.gameBoard = gameBoard;
  }

  get newId() {
    return Date.now();
  }

  get setTurnOrder() {
    return this.players.map((player) => player.id);
  }
}
