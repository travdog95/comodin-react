import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "../../store/game-reducer";
import { uiActions } from "../../store/ui-reducer";
import { updatePlayer } from "../../store/game-actions";

import PlayerCard from "./PlayerCard";
import PlayerDiscardPile from "./PlayerDiscardPile";
import constants from "../../helpers/constants";
import tko from "../../helpers/utilities";

const PlayerCardTable = (props) => {
  const dispatch = useDispatch();
  const { player, players } = props;
  const playerIconClasses = `player-icon ${player.color}`;
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const settings = useSelector((state) => state.game.settings);
  const playerMarbles = tko.getPlayerMarbles(gameBoard, player);
  const currentPlayerId = useSelector((state) => state.game.currentPlayerId);
  const isActivePlayer = parseInt(currentPlayerId) === parseInt(player.id) ? true : false;
  const cardTableClasses = isActivePlayer ? "player-card-table active-player" : "player-card-table";

  const isMarblePlayable = (marble, card) => {
    // Marbles in start
    if (marble.position.indexOf("start") !== -1 && parseInt(marble.paddleBoardId) === player.id) {
      if (
        constants.CARDS.EXIT_START.includes(card.value) &&
        tko.noMarblesInPath(gameBoard, marble, player, card)
      ) {
        return true;
      }
    }

    // Marbles on the track
    if (marble.position.indexOf("track") !== -1) {
      return tko.noMarblesInPath(gameBoard, marble, player, card);
    }
    return false;
  };

  const cardMouseEnterHandler = (e) => {
    const cardElement = e.target;
    const card = {
      src: cardElement.src,
      value: cardElement.dataset.value,
      code: cardElement.dataset.code,
      suit: cardElement.dataset.suit,
    };

    let playableMarbles = [];
    playerMarbles.forEach((marble) => {
      if (isMarblePlayable(marble, card)) playableMarbles.push(marble);
    });

    dispatch(gameActions.setMoveableMarbles(playableMarbles));
  };

  const cardMouseLeaveHandler = (e) => {
    dispatch(gameActions.setMoveableMarbles([]));
  };

  const cardClickHandler = (e) => {
    if (player.hand.length === settings.maxCardsInHand) {
      const cardElement = e.target;
      const card = {
        src: cardElement.src,
        value: cardElement.dataset.value,
        code: cardElement.dataset.code,
        suit: cardElement.dataset.suit,
        playerId: player.id,
      };

      //Update players discardCard and hand
      const newHand = player.hand.filter((cardInHand) => cardInHand.code !== card.code);

      const playerData = { ...player, discardedCard: card, hand: newHand };

      dispatch(updatePlayer(playerData, players));

      //Find clickable marbles
      let clickableMarbles = [];
      playerMarbles.forEach((marble) => {
        if (isMarblePlayable(marble, card)) clickableMarbles.push(marble);
      });

      dispatch(gameActions.setMoveableMarbles([]));
      dispatch(gameActions.setClickableMarbles(clickableMarbles));
      dispatch(
        uiActions.addAuditEvent(`${player.screenName} discarded the ${card.value} of ${card.suit}.`)
      );
    } else {
      dispatch(
        uiActions.showNotification({ type: "primary", message: "You need to move a marble!" })
      );
    }
  };

  return (
    <div className={cardTableClasses}>
      <div className="player-info">
        <div className="player-name">{player.screenName}</div>
        <div className={playerIconClasses}></div>
      </div>
      <div className="deck">
        <div className="draw-pile">
          <img src={require("../../img/back.png")} alt="Draw Pile" />
        </div>
        <div className="discard-pile">
          <PlayerDiscardPile card={player.discardedCard} />
        </div>
        <div className="hand">
          {player.hand.map((card, index) => {
            return (
              <PlayerCard
                key={index}
                card={card}
                onClickCard={cardClickHandler}
                onMouseEnterCard={cardMouseEnterHandler}
                onMouseLeaveCard={cardMouseLeaveHandler}
                isActivePlayer={isActivePlayer}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerCardTable;
