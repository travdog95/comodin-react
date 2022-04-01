import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-reducer";

import PlayerCard from "./PlayerCard";
import PlayerDiscardPile from "./PlayerDiscardPile";

import classes from "./PlayerCardTable.module.css";

import tko from "../../helpers/utilities";

const PlayerCardTable = (props) => {
  const dispatch = useDispatch();

  const { player, players } = props;
  // const playerIconClasses = `player-icon ${player.color}`;
  const currentPlayerId = useSelector((state) => state.game.currentPlayerId);
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const isActivePlayer = parseInt(currentPlayerId) === parseInt(player.id) ? true : false;
  const cardTableClasses = isActivePlayer ? "player-card-table active-player" : "player-card-table";

  const hasPlayableCards = tko.hasPlayableCards(gameBoard, player);

  useEffect(() => {
    if (isActivePlayer && !hasPlayableCards && player.hand.length === 5) {
      dispatch(
        uiActions.showNotification({
          type: "warning",
          message: "You do not have any playable cards! Please discard.",
        })
      );
    }
  }, [isActivePlayer, hasPlayableCards, player, dispatch]);

  return (
    <div
      className={`${classes["player-card-table"]} ${isActivePlayer && classes["active-player"]}`}
    >
      <div className={classes["player-info"]}>
        <div className={classes["player-name"]}>{player.screenName}</div>
        <div className={`${classes["player-icon"]} ${player.color}`}></div>
      </div>
      <div className={classes.deck}>
        <div className={classes["draw-pile"]}>
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
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerCardTable;
