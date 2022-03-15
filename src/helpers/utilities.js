import constants from "./constants";

const utilities = {
  getMarblePositionValue(position) {
    return parseInt(position.substring(position.indexOf("-") + 1));
  },
  getNextTrack(track, numPlayers) {
    return track === numPlayers ? 1 : track + 1;
  },
  getNextPlayerId(currentPlayerId, players) {
    let nextPlayerIdIndex;
    players.forEach((player, index) => {
      if (currentPlayerId === player.id) {
        nextPlayerIdIndex = index + 1;
      }
    });

    //If currentPlayerId is the last player, set nextPlayerIndex to 0
    nextPlayerIdIndex = nextPlayerIdIndex === players.length ? 0 : nextPlayerIdIndex;

    return players[nextPlayerIdIndex].id;
  },
  getPlayerById(players, playerId) {
    const playerArray = players.filter((player) => player.id === playerId);

    return playerArray[0];
  },
  noMarblesInPath(gameBoard, marble, player, card) {
    const paddleBoardId = parseInt(marble.paddleBoardId);
    const positionValue = this.getMarblePositionValue(marble.position);
    const cardValue = card.value;
    const cardNumericalValue = constants.CARDS.VALUES[cardValue];

    let p = 1;
    let currentPositionValue = 0;
    let currentPaddleBoardId = "";
    let currentPosition;

    //Check behind
    if (constants.CARDS.MOVE_BACKWARD.includes(card.value)) {
      if (marble.position.indexOf("track") !== -1) {
        for (p; p <= cardNumericalValue; p++) {
          if (positionValue - p <= 0) {
            currentPositionValue = positionValue - p + constants.NUM_POSITIONS_PER_TRACK;
            currentPaddleBoardId = this.getNextTrack(paddleBoardId, Object.keys(gameBoard).length);
          } else {
            currentPositionValue = positionValue - p;
            currentPaddleBoardId = paddleBoardId;
          }

          currentPosition = gameBoard[currentPaddleBoardId][`track-${currentPositionValue}`];

          //If there is one of the player's own marble, return false;
          if (this.doesPositionHaveOwnMarble(currentPosition, player)) return false;
        }
      }

      return true;
    } else {
      //If marble in start position, check exit for own marble
      if (
        marble.position.indexOf("start") !== -1 &&
        this.doesPositionHaveOwnMarble(gameBoard[player.id]["track-9"], player)
      ) {
        return false;
      }

      //If marble is on the track
      if (marble.position.indexOf("track") !== -1) {
        for (p; p <= cardNumericalValue; p++) {
          if (positionValue + p > constants.NUM_POSITIONS_PER_TRACK) {
            currentPositionValue = positionValue + p - constants.NUM_POSITIONS_PER_TRACK;
            currentPaddleBoardId = this.getNextTrack(paddleBoardId, Object.keys(gameBoard).length);
          } else {
            currentPositionValue = positionValue + p;
            currentPaddleBoardId = paddleBoardId;
          }

          currentPosition = gameBoard[currentPaddleBoardId][`track-${currentPositionValue}`];

          //If there is one of the player's own marble, return false;
          if (this.doesPositionHaveOwnMarble(currentPosition, player)) return false;
        }
      }

      return true;
    }
  },
  doesPositionHaveOwnMarble(position, player) {
    return position.playerId === player.id;
  },
  getPlayerMarbles(gameBoard, player) {
    let marbles = [];

    //Each paddleBoard
    Object.keys(gameBoard).forEach((paddleBoardId) => {
      const paddleBoard = gameBoard[paddleBoardId];
      //Iterate over each position
      Object.keys(paddleBoard).forEach((position) => {
        const marblePlayerId = paddleBoard[position].playerId;

        if (marblePlayerId === player.id) {
          const marbleId = paddleBoard[position].id;
          marbles.push({
            paddleBoardId: parseInt(paddleBoardId),
            id: parseInt(marbleId),
            position,
          });
        }
      });
    });
    return marbles;
  },
  moveMarbleForward(from, cardNumericalValue, gameBoard) {
    let to = {
      position: "",
      positionValue: 0,
      paddleBoardId: 0,
    };

    if (from.positionValue + cardNumericalValue > constants.NUM_POSITIONS_PER_TRACK) {
      to.positionValue =
        from.positionValue + cardNumericalValue - constants.NUM_POSITIONS_PER_TRACK;
      to.paddleBoardId = this.getNextTrack(from.paddleBoardId, Object.keys(gameBoard).length);
    } else {
      to.positionValue = from.positionValue + cardNumericalValue;
      to.paddleBoardId = from.paddleBoardId;
    }

    to.position = `track-${to.positionValue}`;

    return to;
  },
  moveMarbleBackward(from, cardNumericalValue, gameBoard) {
    let to = {
      position: "",
      positionValue: 0,
      paddleBoardId: 0,
    };

    if (from.positionValue - cardNumericalValue <= 0) {
      to.positionValue =
        from.positionValue - cardNumericalValue + constants.NUM_POSITIONS_PER_TRACK;
      to.paddleBoardId = this.getNextTrack(from.paddleBoardId, Object.keys(gameBoard).length);
    } else {
      to.positionValue = from.positionValue - cardNumericalValue;
      to.paddleBoardId = from.paddleBoardId;
    }

    to.position = `track-${to.positionValue}`;

    return to;
  },
  async newDeck(numberOfDecks) {
    const response = await fetch(
      `${constants.DECK_OF_CARDS_API}new/shuffle/?deck_count=${numberOfDecks}&jokers_enabled=true`
    );

    if (response.status >= 200 && response.status <= 299) {
      const data = await response.json();
      return data.deck_id;
    }
  },
  async drawCards(deck_id, numCards) {
    const response = await fetch(
      `${constants.DECK_OF_CARDS_API}${deck_id}/draw/?count=${numCards}`
    );

    if (response.status >= 200 && response.status <= 299) {
      const data = await response.json();
      const cards = data.cards;

      return cards;
    } else {
      return null;
    }
  },
};

export default utilities;
