const PlayerCard = (props) => {
  const card = props.card;
  const suit = card.suit;
  const alt = `${card.value} of ${suit}`;

  return (
    <div
      onClick={props.onClickCard}
      onMouseEnter={props.onMouseEnterCard}
      onMouseLeave={props.onMouseLeaveCard}
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
