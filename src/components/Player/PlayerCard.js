import React, { useState } from "react";

const PlayerCard = (props) => {
  const card = props.card;
  const suit = card.suit;
  const alt = `${card.value} of ${suit}`;

  const cardMouseEnterHandler = (e) => {
    // console.log("show marbles");
    setMarblesShown(true);
  };

  const cardMouseLeaveHandler = (e) => {
    // console.log("hide marbles");
    setMarblesShown(false);
  };

  const [marblesShown, setMarblesShown] = useState(false);

  return (
    <div
      onClick={props.onClickCard}
      onMouseEnter={cardMouseEnterHandler}
      onMouseLeave={cardMouseLeaveHandler}
    >
      <img
        src={card.image}
        className="card"
        alt={alt}
        data-code={card.code}
        data-value={card.value}
        data-suit={card.suit}
      ></img>
    </div>
  );
};

export default PlayerCard;
