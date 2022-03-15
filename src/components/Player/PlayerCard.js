const PlayerCard = (props) => {
  const { card, suit, isActivePlayer, onClickCard, onMouseEnterCard, onMouseLeaveCard } = props;
  const alt = `${card.value} of ${suit}`;

  return (
    <div
      onClick={isActivePlayer ? onClickCard : undefined}
      onMouseEnter={isActivePlayer ? onMouseEnterCard : undefined}
      onMouseLeave={isActivePlayer ? onMouseLeaveCard : undefined}
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
