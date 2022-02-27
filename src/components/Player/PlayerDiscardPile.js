const PlayerDiscardPile = (props) => {
  const discardedCard = props.card;
  let discardPileContent = "";

  if (Object.keys(discardedCard).length > 0) {
    const alt = `${discardedCard.value} of ${discardedCard.suit}`;

    discardPileContent = <img src={discardedCard.src} className="card" alt={alt} />;
  }
  return discardPileContent;
};

export default PlayerDiscardPile;
