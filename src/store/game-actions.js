import { gameActions } from "./game-reducer";
import { uiActions } from "./ui-reducer";

import constants from "../helpers/constants";
import tko from "../helpers/utilities";

export const updatePlayer = (playerData, players, auditEvents) => {
  return (dispatch) => {
    const newPlayersData = players.map((player) => {
      const newPlayerData = player.id === playerData.id ? playerData : player;
      return newPlayerData;
    });

    dispatch(gameActions.setPlayers(newPlayersData));

    //Dispatch audit events
    if (auditEvents) {
      auditEvents.forEach((event) => {
        dispatch(uiActions.addAuditEvent(event));
      });
    }
  };
};

export const createGame = (settings) => {
  return async (dispatch) => {
    let gameBoard = {};
    const promises = settings.playerNames.map(async (playerName, index) => {
      const playerId = index + 1;
      gameBoard[playerId] = {};
      //Get new deck from card API
      const deck_id = await tko.newDeck(1);
      const deck = { id: deck_id, numDecks: 1 };

      //Build player hand
      const hand = await tko.drawCards(deck_id, settings.maxCardsInHand);

      //Build gameBoard
      constants.PADDLE_ITEMS.forEach((item) => {
        if (item.position) {
          gameBoard[playerId][item.position] = {};
        }
      });

      //Default marble positions
      const marbles = constants.TRACK.START_POSITIONS.map((marblePosition, index) => {
        gameBoard[playerId][marblePosition] = { playerId, id: index + 1 };
        return {
          paddleBoardId: playerId,
          position: marblePosition,
        };
      });

      return {
        id: playerId,
        screenName: playerName,
        settings,
        color: constants.MARBLES.COLORS[index],
        deck,
        hand,
        marbles,
        discardedCard: {},
        path: [],
      };
    });

    const tempPlayers = await Promise.all(promises);

    //Build player paths
    const players = tempPlayers.map((tempPlayer) => {
      let player = { ...tempPlayer };
      //Build path to home (track 5 to home 1)
      let path = [];
      for (let i = 5; i <= constants.TRACK.NUM_POSITIONS; i++) {
        path.push({ paddleBoardId: tempPlayer.id, position: `track-${i}` });
      }

      const otherPlayers = tempPlayers.filter((otherPlayer) => otherPlayer.id !== tempPlayer.id);

      otherPlayers.forEach((otherPlayer) => {
        for (let t = 1; t <= constants.TRACK.NUM_POSITIONS; t++) {
          path.push({ paddleBoardId: otherPlayer.id, position: `track-${t}` });
        }
      });
      player.path = path;

      //Add last positions up to, and including the door
      for (let j = 1; j <= 4; j++) {
        path.push({ paddleBoardId: tempPlayer.id, position: `track-${j}` });
      }

      //Add home positions
      constants.TRACK.HOME_POSITIONS.forEach((homePosition) => {
        path.push({ paddleBoardId: tempPlayer.id, position: homePosition });
      });

      return player;
    });

    const game = {
      id: Date.now(),
      settings,
      players,
      gameBoard,
    };

    console.log(game);

    dispatch(gameActions.updateGameBoard(gameBoard));
    dispatch(gameActions.setPlayers(players));
    dispatch(gameActions.setSettings(settings));

    dispatch(uiActions.addAuditEvent(`The game has started!`));
    dispatch(setNextPlayerId(null, players));
  };
};

export const setNextPlayerId = (currentPlayerId, players, auditEvents) => {
  return (dispatch) => {
    const nextPlayerId =
      currentPlayerId === null ? players[0].id : tko.getNextPlayerId(currentPlayerId, players);

    dispatch(gameActions.setCurrentPlayerId(nextPlayerId));

    const nextPlayer = tko.getPlayerById(players, nextPlayerId);
    const nextPlayerAuditText = `${nextPlayer.screenName}'s turn.`;

    let events = [];
    if (auditEvents) {
      events = [...auditEvents, nextPlayerAuditText];
    } else {
      events = [nextPlayerAuditText];
    }
    //Dispatch audit events
    events.forEach((event) => {
      dispatch(uiActions.addAuditEvent(event));
    });
  };
};
