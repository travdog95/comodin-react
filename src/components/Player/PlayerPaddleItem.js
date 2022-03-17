import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "../../store/game-reducer";
import { uiActions } from "../../store/ui-reducer";
import { drawCards } from "../../store/game-actions";

import constants from "../../helpers/constants";
import tko from "../../helpers/utilities";

const PlayerPaddleItem = (props) => {
  const dispatch = useDispatch();

  const { item, paddleBoardId } = props;

  const moveableMarbles = useSelector((state) => state.game.moveableMarbles);
  const clickableMarbles = useSelector((state) => state.game.clickableMarbles);
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const players = useSelector((state) => state.game.players);

  let clickable = false;
  let className = `paddle-item ${item.class}`;
  const label = item.label ? item.label : "";
  let marble = {};
  let marblePlayer = {};

  // If position on board
  if (item.position) {
    //If position has a marble
    if (Object.keys(gameBoard[paddleBoardId][item.position]).length > 0) {
      marble = gameBoard[paddleBoardId][item.position];
      marblePlayer = tko.getPlayerById(players, marble.playerId);
      className += ` ${marblePlayer.color}`;

      //Highlight moveable marble
      moveableMarbles.forEach((moveableMarble) => {
        if (
          moveableMarble.position === item.position &&
          moveableMarble.paddleBoardId === paddleBoardId
        ) {
          className += " moveable";
        }
      });

      //Highlight clickable marble
      clickableMarbles.forEach((clickableMarble) => {
        if (
          clickableMarble.position === item.position &&
          clickableMarble.paddleBoardId === paddleBoardId
        ) {
          className += " clickable";
          clickable = true;
        }
      });
    }
  }

  const marbleClickHandler = () => {
    const from = {
      position: item.position,
      positionValue: tko.getMarblePositionValue(item.position),
      paddleBoardId: paddleBoardId,
    };
    let to = {};
    const cardValue = marblePlayer.discardedCard.value;
    let newGameBoard = { ...gameBoard };
    let eventText = "";

    //Move marble from start
    if (from.position.indexOf("start") >= 0 && constants.CARDS.EXIT_START.includes(cardValue)) {
      //Update to and from positions
      newGameBoard[from.paddleBoardId] = {
        ...newGameBoard[from.paddleBoardId],
        [constants.TRACK.EXIT]: marble,
        [from.position]: {},
      };

      eventText = "out of start";
    }

    //If marble is on track or home
    if (from.position.indexOf("track") !== -1) {
      //Determine direction
      const direction = constants.CARDS.MOVE_BACKWARD.includes(cardValue) ? -1 : 1;
      const directionText = direction === 1 ? "forwards" : "backwards";
      const cardNumericalValue = constants.CARDS.VALUES[cardValue];

      if (direction === 1) {
        to = tko.moveMarbleForward(marblePlayer, from, cardNumericalValue, gameBoard);
      } else {
        to = tko.moveMarbleBackward(from, cardNumericalValue, gameBoard);
      }

      //Update from position
      newGameBoard[from.paddleBoardId] = {
        ...newGameBoard[from.paddleBoardId],
        [from.position]: {},
      };

      //Update to position
      newGameBoard[to.paddleBoardId] = {
        ...newGameBoard[to.paddleBoardId],
        [to.position]: marble,
      };

      eventText = `${directionText} ${cardNumericalValue} spaces`;
    }

    //Update board and UI
    dispatch(gameActions.updateGameBoard(newGameBoard));

    //Remove marble clickability
    dispatch(gameActions.setClickableMarbles([]));

    //Add event
    dispatch(uiActions.addAuditEvent(`${marblePlayer.screenName} moved marble ${eventText}.`));

    const nextPlayerId = tko.getNextPlayerId(marblePlayer.id, players);
    const nextPlayer = tko.getPlayerById(players, nextPlayerId);

    //Draw card
    dispatch(drawCards(1, marblePlayer, players, `${nextPlayer.screenName}'s turn.`));

    //Set next player's turn
    dispatch(gameActions.setNextPlayerId(nextPlayerId));
  };

  return (
    <div className={className} onClick={clickable ? marbleClickHandler : undefined}>
      {label}
    </div>
  );
};

export default PlayerPaddleItem;
