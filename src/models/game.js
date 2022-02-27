export default class Game {
  constructor(players, settings) {
    this.id = this.newId;
    this.settings = settings;
    this.players = players;
    this.turn = "";
    this.turnOrder = [];
    this.events = [];
  }

  get newId() {
    return Date.now();
  }
}
