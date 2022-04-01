import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "../../store/game-reducer";
import { toast } from "react-toastify";

import { updatePlayer, setNextPlayerId } from "../../store/game-actions";

import classes from "./PlayerCard.module.css";
import tko from "../../helpers/utilities";

const PlayerCard = (props) => {
  const dispatch = useDispatch();

  const { card, isActivePlayer, player, players, hasPlayableCards } = props;
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const settings = useSelector((state) => state.game.settings);
  const playerMarbles = tko.getPlayerMarbles(gameBoard, player);
  const alt = `${card.value} of ${card.suit}`;

  const cardMouseEnterHandler = () => {
    let playableMarbles = [];
    playerMarbles.forEach((marble) => {
      if (tko.isMarblePlayable(gameBoard, marble, player, card)) playableMarbles.push(marble);
    });
    dispatch(gameActions.setMoveableMarbles(playableMarbles));
  };

  const cardMouseLeaveHandler = () => {
    dispatch(gameActions.setMoveableMarbles([]));
  };

  const cardClickHandler = async () => {
    let auditEvents = [];
    if (player.hand.length === settings.maxCardsInHand) {
      //Add playerId to clickedCard
      const clickedCard = { ...card, playerId: player.id };

      //Update players discardCard and hand
      const newHand = player.hand.filter((cardInHand) => cardInHand.code !== card.code);

      const playerData = { ...player, discardedCard: clickedCard, hand: newHand };

      auditEvents.push(`${player.screenName} discarded the ${card.value} of ${card.suit}.`);

      if (!hasPlayableCards) {
        //Draw card
        const cards = await tko.drawCards(player.deck.id, 1);

        //Add card to hand
        playerData.hand.push(cards[0]);

        //Update player data
        dispatch(updatePlayer(playerData, players));

        //Set next player's turn
        dispatch(setNextPlayerId(player.id, players, auditEvents));
      } else {
        dispatch(updatePlayer(playerData, players, auditEvents));

        //Find clickable marbles
        let clickableMarbles = [];
        playerMarbles.forEach((marble) => {
          if (tko.isMarblePlayable(gameBoard, marble, player, card)) clickableMarbles.push(marble);
        });

        dispatch(gameActions.setMoveableMarbles([]));
        dispatch(gameActions.setClickableMarbles(clickableMarbles));
      }
    } else {
      toast.info("You need to move a marble!");
    }
  };

  return (
    <div
      onClick={isActivePlayer ? cardClickHandler : undefined}
      onMouseEnter={isActivePlayer ? cardMouseEnterHandler : undefined}
      onMouseLeave={isActivePlayer ? cardMouseLeaveHandler : undefined}
    >
      <img
        src={card.image}
        className={classes.card}
        alt={alt}
        data-code={card.code}
        data-value={card.value}
        data-suit={card.suit}
      ></img>
    </div>
  );
};

export default PlayerCard;
