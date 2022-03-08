export default class Game {
  constructor(players, settings) {
    this.id = this.newId;
    this.settings = settings;
    this.players = players;
    this.turn = "";
    this.turnOrder = this.setTurnOrder;
    this.events = [];
  }

  get newId() {
    return Date.now();
  }

  get setTurnOrder() {
    return this.players.map((player) => player.id);
  }
}
