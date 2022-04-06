import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import PlayerCard from "./PlayerCard";
import PlayerDiscardPile from "./PlayerDiscardPile";

import classes from "./PlayerCardTable.module.css";

import tko from "../../helpers/utilities";
import constants from "../../helpers/constants";

const PlayerCardTable = (props) => {
  const { player, players } = props;
  const currentPlayerId = useSelector((state) => state.game.currentPlayerId);
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const isActivePlayer = parseInt(currentPlayerId) === parseInt(player.id) ? true : false;

  //Check to see if user has playable cards
  const hasPlayableCards = tko.hasPlayableCards(gameBoard, player);

  //only playable card is a joker
  //This is wrong
  let onlyPlayableCardIsJoker = false;
  if (hasPlayableCards) {
    const jokers = player.hand.filter((card) => card.value === "JOKER");
    onlyPlayableCardIsJoker = jokers.length === 0 ? false : true;
  }

  useEffect(() => {
    if (
      isActivePlayer &&
      !hasPlayableCards &&
      player.hand.length === constants.HAND.NUM_CARDS &&
      !onlyPlayableCardIsJoker
    ) {
      toast.warning("You do not have any playable cards! Please discard.");
    }
  }, [isActivePlayer, hasPlayableCards, player.hand.length, onlyPlayableCardIsJoker]);

  return (
    <div
      className={`${classes["player-card-table"]} ${isActivePlayer && classes["active-player"]}`}
    >
      <div className={classes["player-info"]}>
        <div className={classes["player-name"]}>{player.screenName}</div>
        <div className={`${classes["player-icon"]} ${player.color}`}></div>
      </div>
      <div className={classes.deck}>
        <div className={`${classes["draw-pile"]}  ${!isActivePlayer && classes.inactive}`}>
          <img src={require("../../img/back.png")} alt="Draw Pile" />
        </div>
        <div className={classes["discard-pile"]}>
          <PlayerDiscardPile card={player.discardedCard} />
        </div>
        <div className={classes.hand}>
          {player.hand.map((card, index) => {
            return (
              <PlayerCard
                key={index}
                card={card}
                isActivePlayer={isActivePlayer}
                player={player}
                players={players}
                hasPlayableCards={hasPlayableCards}
                onlyPlayableCardIsJoker={onlyPlayableCardIsJoker}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerCardTable;
