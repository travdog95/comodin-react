import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "../../store/game-reducer";
import { uiActions } from "../../store/ui-reducer";
import PlayerCard from "./PlayerCard";
import PlayerDiscardPile from "./PlayerDiscardPile";
import constants from "../../helpers/constants";
import tko from "../../helpers/utilities";

const PlayerCardTable = (props) => {
  const dispatch = useDispatch();
  const game = props.game;
  const player = props.player;
  const playerIconClasses = `player-icon ${player.color}`;
  const discardedCard = useSelector((state) => state.game.discardedCard);
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const playerMarbles = tko.getPlayerMarbles(gameBoard, player);

  const [hand, setHand] = useState(player.hand);

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
    if (hand.length === game.settings.maxCardsInHand) {
      const cardElement = e.target;
      const card = {
        src: cardElement.src,
        value: cardElement.dataset.value,
        code: cardElement.dataset.code,
        suit: cardElement.dataset.suit,
        playerId: player.id,
      };
      dispatch(gameActions.setDiscardedCard(card));

      setHand((prevHand) => {
        return [...prevHand.filter((cardInHand) => cardInHand.code !== card.code)];
      });

      let clickableMarbles = [];
      playerMarbles.forEach((marble) => {
        if (isMarblePlayable(marble, card)) clickableMarbles.push(marble);
      });

      dispatch(gameActions.setMoveableMarbles([]));
      dispatch(gameActions.setClickableMarbles(clickableMarbles));
      dispatch(
        uiActions.addAuditEvent(`${player.screenName} discarded ${card.value} of ${card.suit}`)
      );
    } else {
      dispatch(uiActions.sendMessage({ type: "info", message: "You need to move a marble!" }));
    }
  };

  const drawPileClickHandler = async (e) => {
    if (hand.length === game.settings.maxCardsInHand) {
      dispatch(uiActions.sendMessage({ type: "info", message: "Your hand is already full!" }));
    } else {
      const drawnCards = await drawCards(1);
      setHand((prevHand) => {
        return [...prevHand, drawnCards[0]];
      });
      dispatch(uiActions.addAuditEvent(`${player.screenName} drew a card.`));
      //Advance to the next player's turn
      const nextPlayerId = tko.getNextPlayerId(player.id, game.players);
    }
  };

  const drawCards = async (numCards) => {
    const response = await fetch(
      `${constants.DECK_OF_CARDS_API}${player.deck.id}/draw/?count=${numCards}`
    );

    if (response.status >= 200 && response.status <= 299) {
      const data = await response.json();
      const cards = data.cards;

      return cards;
    } else {
      return null;
    }
  };

  return (
    <div className="player-card-table">
      <div className="player-info">
        <div className="player-name">{player.screenName}</div>
        <div className={playerIconClasses}></div>
      </div>
      <div className="deck">
        <div className="draw-pile" onClick={drawPileClickHandler}>
          <img src={require("../../img/back.png")} alt="Draw Pile" />
        </div>
        <div className="discard-pile">
          <PlayerDiscardPile card={discardedCard} player={player} />
        </div>
        <div className="hand">
          {hand.map((card, index) => {
            return (
              <PlayerCard
                key={index}
                card={card}
                onClickCard={cardClickHandler}
                onMouseEnterCard={cardMouseEnterHandler}
                onMouseLeaveCard={cardMouseLeaveHandler}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerCardTable;
