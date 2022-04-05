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
    if (constants.CARDS.MOVE_BACKWARDS.includes(card.value)) {
      if (marble.position.indexOf("track") !== -1) {
        for (p; p <= cardNumericalValue; p++) {
          if (positionValue - p <= 0) {
            currentPositionValue = positionValue - p + constants.TRACK.NUM_POSITIONS;
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

      //If marble is on the track, or in home
      if (marble.position.indexOf("start") === -1) {
        // console.log("forward", cardNumericalValue);

        //Find position on path
        let startPositionIndex = 0;
        player.path.forEach((pathItem, index) => {
          if (
            marble.position === pathItem.position &&
            marble.paddleBoardId === pathItem.paddleBoardId
          ) {
            startPositionIndex = index;
          }
        });

        //See if another marble is on path using the card played
        let i = 1;
        let pathItem = "";
        for (i; i <= cardNumericalValue; i++) {
          pathItem = player.path[i + startPositionIndex];
          if (pathItem) {
            currentPosition = gameBoard[pathItem.paddleBoardId][pathItem.position];

            //If there is one of the player's own marble, return false;
            if (this.doesPositionHaveOwnMarble(currentPosition, player)) return false;
          } else {
            //End of the path
            return false;
          }
        }
      }

      return true;
    }
  },
  doesPositionHaveOwnMarble(position, player) {
    return position.playerId === player.id;
  },
  getMarbles(gameBoard, options) {
    const { player, paddleBoardSection, notPlayer, teammates } = options;
    let marbles = [];

    //Each paddleBoard
    Object.keys(gameBoard).forEach((paddleBoardId) => {
      const paddleBoard = gameBoard[paddleBoardId];
      let include = [];

      //Iterate over each position
      Object.keys(paddleBoard).forEach((position) => {
        include = [];
        //Only get marbles for player
        if (player !== undefined) {
          if (paddleBoard[position].playerId !== player.id) {
            include.push(false);
          }
        }

        //Only include marbles for paddleBoardSection
        if (paddleBoardSection !== undefined) {
          if (position.indexOf(paddleBoardSection) === -1) {
            include.push(false);
          }
        }

        //Only include marbles of all other players
        if (notPlayer !== undefined) {
          if (
            paddleBoard[position].playerId === undefined ||
            paddleBoard[position].playerId === notPlayer.id
          ) {
            include.push(false);
          }
        }

        if (teammates !== undefined) {
          //find teammates of player
          //Don't include marbles non-teammate marbles
        }

        if (!include.includes(false)) {
          marbles.push({
            paddleBoardId: parseInt(paddleBoardId),
            playerId: paddleBoard[position].playerId,
            id: parseInt(paddleBoard[position].id),
            position,
          });
        }
      });
    });

    return marbles;
  },
  moveMarble(player, from, direction, cardNumericalValue, gameBoard) {
    let to = {
      position: "",
      positionValue: 0,
      paddleBoardId: 0,
    };

    //Find position on path
    let startPositionIndex = 0;
    player.path.forEach((pathItem, index) => {
      if (from.position === pathItem.position && from.paddleBoardId === pathItem.paddleBoardId) {
        startPositionIndex = index;
      }
    });

    //See if another marble is on path using the card played
    let toIndex = 0;

    if (direction === 1) {
      toIndex = cardNumericalValue + startPositionIndex;
    } else {
      const difference = startPositionIndex - cardNumericalValue;
      const pathSansHome = player.path.length - constants.TRACK.HOME_POSITIONS.length;
      toIndex = difference < 0 ? pathSansHome + difference : difference;
    }

    const pathItem = player.path[toIndex];
    if (pathItem) {
      const displacedMarble = this.getDisplacedMarble(gameBoard, pathItem);
      to = { ...pathItem, displacedMarble };
    } else {
      //End of the path
      return false;
    }

    return to;
  },
  async newDeck(numberOfDecks) {
    const response = await fetch(
      `${constants.DECK_OF_CARDS_API}new/shuffle/?deck_count=${numberOfDecks}&jokers_enabled=true`
    );

    if (!response.ok) {
      throw new Error("Could not fetch cards!");
    }
    const data = await response.json();
    return data.deck_id;
  },
  async drawCards(deck_id, numCards) {
    const response = await fetch(
      `${constants.DECK_OF_CARDS_API}${deck_id}/draw/?count=${numCards}`
    );

    if (!response.ok) {
      throw new Error("Could not draw cards!");
    }

    const data = await response.json();
    const cards = data.cards;

    return cards;
  },
  isMarblePlayable(gameBoard, marble, player, card) {
    //Joker
    if (card.value === "JOKER") {
      //if there are any marbles on the track that don't belong to player
      const marblesOnTrack = this.getMarbles(gameBoard, {
        notPlayer: player,
        paddleBoardSection: "track",
      });

      return marblesOnTrack.length > 0 ? true : false;
    }

    // Marbles in start
    if (marble.position.indexOf("start") !== -1 && parseInt(marble.paddleBoardId) === player.id) {
      if (
        constants.CARDS.EXIT_START.includes(card.value) &&
        this.noMarblesInPath(gameBoard, marble, player, card)
      ) {
        return true;
      }
    }

    // Marbles on the track or in home and card is not a move backwards card
    if (
      marble.position.indexOf("track") !== -1 ||
      (marble.position.indexOf("home") !== -1 &&
        !constants.CARDS.MOVE_BACKWARDS.includes(card.value))
    ) {
      return this.noMarblesInPath(gameBoard, marble, player, card);
    }
    return false;
  },
  hasPlayableCards(gameBoard, player) {
    const playerMarbles = this.getMarbles(gameBoard, { player });

    let playableMarbles = [];

    //Iterate over player's hand
    player.hand.forEach((card) => {
      playerMarbles.forEach((marble) => {
        if (this.isMarblePlayable(gameBoard, marble, player, card)) playableMarbles.push(marble);
      });
    });

    return playableMarbles.length === 0 ? false : true;
  },
  findEmptyStartPosition(playerId, gameBoard) {
    const startPositions = ["start-1", "start-2", "start-3", "start-4", "start-5"];
    let emptyStartPosition = "";
    startPositions.forEach((startPosition) => {
      //check to see if marble exists in startPosition
      if (Object.keys(gameBoard[playerId][startPosition]).length === 0) {
        emptyStartPosition = startPosition;
      }
    });
    return emptyStartPosition;
  },
  getDisplacedMarble(gameBoard, paddleItem) {
    let displacedMarble = {};
    if (paddleItem) {
      if (Object.keys(gameBoard[paddleItem.paddleBoardId][paddleItem.position]).length !== 0) {
        displacedMarble = gameBoard[paddleItem.paddleBoardId][paddleItem.position];
      }
    }
    return displacedMarble;
  },
  placeDisplacedMarble(gameBoard, displacedMarble) {
    let newGameBoard = { ...gameBoard };

    const emptyStartPosition = this.findEmptyStartPosition(displacedMarble.playerId, gameBoard);

    newGameBoard[displacedMarble.playerId] = {
      ...newGameBoard[displacedMarble.playerId],
      [emptyStartPosition]: {
        playerId: displacedMarble.playerId,
        id: displacedMarble.id,
      },
    };

    return newGameBoard;
  },
};

export default utilities;
