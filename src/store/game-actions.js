import { gameActions } from "./game-reducer";
import { uiActions } from "./ui-reducer";

import constants from "../helpers/constants";
// import tko from "../helpers/utilities";

export const drawCards = (numCards, player, players) => {
  return async (dispatch) => {
    const fetchCards = async () => {
      const response = await fetch(
        `${constants.DECK_OF_CARDS_API}${player.deck.id}/draw/?count=${numCards}`
      );

      if (!response.ok) {
        throw new Error("Could not fetch cards!");
      }

      const data = await response.json();

      return data;
    };

    try {
      const cardsData = await fetchCards();
      const cards = cardsData.cards;

      const newPlayersData = players.map((playerData) => {
        let newPlayerData = playerData;
        if (player.id === newPlayerData.id) {
          //Add cards to hand
          const newHand = newPlayerData.hand.concat(cards);
          newPlayerData = { ...newPlayerData, hand: newHand };
        }
        return newPlayerData;
      });

      //Add card to hand
      dispatch(gameActions.setPlayers(newPlayersData));

      dispatch(uiActions.addAuditEvent(`${player.screenName} drew a card.`));
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          type: "danger",
          message: "Failed to draw cards!",
        })
      );
    }
  };
};

export const updatePlayer = (playerData, players) => {
  return (dispatch) => {
    const newPlayersData = players.map((player) => {
      const newPlayerData = player.id === playerData.id ? playerData : player;
      return newPlayerData;
    });

    dispatch(gameActions.setPlayers(newPlayersData));
  };
};
