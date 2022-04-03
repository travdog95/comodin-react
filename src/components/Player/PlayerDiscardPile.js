import classes from "./PlayerCard.module.css";

const PlayerDiscardPile = (props) => {
  const { card } = props;
  let discardPileContent = "";

  if (Object.keys(card).length > 0) {
    const alt = `${card.value} of ${card.suit}`;

    discardPileContent = (
      <img src={card.image} className={`${classes.card} ${classes["discard-card"]}`} alt={alt} />
    );
  }
  return discardPileContent;
};

export default PlayerDiscardPile;
