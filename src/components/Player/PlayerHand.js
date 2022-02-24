function PlayerHand(props) {
  const card = props.card;
  const suit = card.suit;
  const alt = `${card.value} of ${suit}`;

  return <img src={card.image} className="card" alt={alt}></img>;
}

export default PlayerHand;
