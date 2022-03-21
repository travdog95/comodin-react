import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "../../store/game-reducer";
import { uiActions } from "../../store/ui-reducer";
import { updatePlayer, drawCards, setNextPlayerId } from "../../store/game-actions";

import tko from "../../helpers/utilities";

const PlayerCard = (props) => {
  const dispatch = useDispatch();

  const { card, suit, isActivePlayer, player, players, hasPlayableCards } = props;
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const settings = useSelector((state) => state.game.settings);
  const playerMarbles = tko.getPlayerMarbles(gameBoard, player);
  const alt = `${card.value} of ${suit}`;

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

  const cardClickHandler = () => {
    if (player.hand.length === settings.maxCardsInHand) {
      //Add playerId to clickedCard
      const clickedCard = { ...card, playerId: player.id };

      //Update players discardCard and hand
      const newHand = player.hand.filter((cardInHand) => cardInHand.code !== card.code);

      const playerData = { ...player, discardedCard: clickedCard, hand: newHand };

      dispatch(updatePlayer(playerData, players));

      if (!hasPlayableCards) {
        console.log("has no playable cards", player);
        const nextPlayer = tko.getPlayerById(players, tko.getNextPlayerId(player.id, players));

        //Draw card
        dispatch(drawCards(1, player, players, `${nextPlayer.screenName}'s turn.`));

        //Set next player's turn
        dispatch(setNextPlayerId(player.id, players));
      } else {
        //Find clickable marbles
        let clickableMarbles = [];
        playerMarbles.forEach((marble) => {
          if (tko.isMarblePlayable(gameBoard, marble, player, card)) clickableMarbles.push(marble);
        });

        dispatch(gameActions.setMoveableMarbles([]));
        dispatch(gameActions.setClickableMarbles(clickableMarbles));
      }

      dispatch(
        uiActions.addAuditEvent(`${player.screenName} discarded the ${card.value} of ${card.suit}.`)
      );
    } else {
      dispatch(
        uiActions.showNotification({ type: "primary", message: "You need to move a marble!" })
      );
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
