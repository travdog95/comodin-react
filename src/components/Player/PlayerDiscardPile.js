const PlayerDiscardPile = (props) => {
  const discardedCard = props.card;
  const player = props.player;
  let discardPileContent = "";

  if (Object.keys(discardedCard).length > 0 && discardedCard.playerId === player.id) {
    const alt = `${discardedCard.value} of ${discardedCard.suit}`;

    discardPileContent = <img src={discardedCard.src} className="card" alt={alt} />;
  }
  return discardPileContent;
};

export default PlayerDiscardPile;
