import React, { useState } from "react";

import Card from "./PlayerCard";
import PlayerDiscardPile from "./PlayerDiscardPile";
import constants from "../../helpers/constants";

const PlayerCardTable = (props) => {
  const game = props.game;
  const player = props.player;
  const playerIconClasses = `player-icon ${player.color}`;

  const [hand, setHand] = useState(player.hand);
  const [discardedCard, setDiscardedCard] = useState(player.discardedCard);

  const cardClickHandler = (e) => {
    if (hand.length === game.settings.maxCardsInHand) {
      const card = e.target;

      setDiscardedCard({
        src: card.src,
        value: card.dataset.value,
        code: card.dataset.code,
        suit: card.dataset.suit,
      });

      setHand((prevHand) => {
        return [...prevHand.filter((cardInHand) => cardInHand.code !== card.dataset.code)];
      });
    } else {
      console.log("You already discarded!");
    }
  };

  const drawPileClickHandler = async (e) => {
    if (hand.length === game.settings.maxCardsInHand) {
      console.log("Hand is full.");
    } else {
      const drawnCards = await drawCards(1);
      setHand((prevHand) => {
        return [...prevHand, drawnCards[0]];
      });
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
          <PlayerDiscardPile card={discardedCard} />
        </div>
        <div className="hand">
          {hand.map((card, index) => {
            return <Card key={index} card={card} onClickCard={cardClickHandler} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerCardTable;
