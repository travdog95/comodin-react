import Player from "./player";
import Deck from "./deck";

import constants from "../helpers/constants";

export default class Game {
  constructor(settings) {
    this.id = this.newId;
    this.settings = settings;
    this.players = [];
    this.turn = "";
    this.turnOrder = [];
  }

  get newId() {
    return Date.now();
  }

  get numPlayers() {
    return this.playerNames.length;
  }

  async initPlayer(id, screenName) {
    let playerData = {};

    playerData.id = id;
    playerData.screenName = screenName;

    //Get new deck of cards
    const numOfDecks = 1;
    const deck = await this.newDeck(numOfDecks);
    playerData.deck = new Deck(deck.deck_id, numOfDecks);

    //Assign color
    playerData.color = constants.MARBLE_COLORS[id - 1];

    //Place marbles in start
    playerData.marbles = this.loadMarblesToStartPositions(5);

    //Deal hand
    playerData.hand = await this.dealHand(this.settings.maxCardsInHand, playerData.deck);

    return playerData;
  }

  async newDeck(numOfDecks) {
    const response = await fetch(
      `${constants.DECK_OF_CARDS_API}new/shuffle/?deck_count=${numOfDecks}&jokers_enabled=true`
    );

    if (response.status >= 200 && response.status <= 299) {
      const data = await response.json();
      return data;
    } else {
      return false;
    }
  }

  async dealHand(numCards, deck) {
    let hand = [];
    const cards = await deck.drawCards(numCards);

    cards.forEach((card) => {
      hand.push(card);
    });

    return hand;
  }

  loadMarblesToStartPositions(numMarbles) {
    let marbles = [];
    let m = 0;
    for (m; m < numMarbles; m++) {
      const marbleId = m + 1;
      const position = `start-${marbleId}`;
      marbles.push(position);
    }
    return marbles;
  }

  async startNewGame() {
    //Display paddles
    this.settings.playerNames.forEach(async (playerName, playerIndex) => {
      const playerData = await this.initPlayer(playerIndex + 1, playerName);

      const player = new Player(
        playerData.id,
        playerData.screenName,
        this.settings,
        playerData.color,
        playerData.deck,
        playerData.hand,
        playerData.marbles
      );

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
