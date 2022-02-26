function PlayerCard(props) {
  const card = props.card;
  const suit = card.suit;
  const alt = `${card.value} of ${suit}`;

  const cardClickHandler = (e) => {
    console.log("card discarded");
  };
  return (
    <div onClick={cardClickHandler}>
      <img src={card.image} className="card" alt={alt}></img>
    </div>
  );
}

export default PlayerCard;
