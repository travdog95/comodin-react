import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "../../store/game-reducer";
import constants from "../../helpers/constants";
import tko from "../../helpers/utilities";

function PlayerPaddleItem(props) {
  const dispatch = useDispatch();

  const moveableMarbles = useSelector((state) => state.game.moveableMarbles);
  const clickableMarbles = useSelector((state) => state.game.clickableMarbles);
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const discardedCard = useSelector((state) => state.game.discardedCard);
  const game = props.game;

  let clickable = false;

  const item = props.item;
  const paddleBoardPlayer = props.paddleBoardPlayer;
  let className = `paddle-item ${item.class}`;
  const label = item.label ? item.label : "";
  let marble = {};

  // If position on board
  if (item.position) {
    //If position has a marble
    if (Object.keys(gameBoard[paddleBoardPlayer.id][item.position]).length > 0) {
      marble = gameBoard[paddleBoardPlayer.id][item.position];
      const marblePlayer = tko.getPlayerById(game.players, marble.playerId);
      className += ` ${marblePlayer.color}`;

      //Highlight moveable marble
      moveableMarbles.forEach((moveableMarble) => {
        if (
          moveableMarble.position === item.position &&
          moveableMarble.paddleBoardPlayerId === paddleBoardPlayer.id
        ) {
          className += " moveable";
        }
      });

      //Highlight clickable marble
      clickableMarbles.forEach((clickableMarble) => {
        if (
          clickableMarble.position === item.position &&
          clickableMarble.paddleBoardPlayerId === paddleBoardPlayer.id
        ) {
          className += " clickable";
          clickable = true;
        }
      });
    }
  }

  const marbleClickHandler = (e) => {
    console.log("marble clicked");
    const fromPosition = item.position;
    const fromPositionValue = tko.getMarblePositionValue(fromPosition);
    const fromPaddleBoardId = paddleBoardPlayer.id;
    const cardValue = discardedCard.value;
    let toPosition = "";
    let toPositionValue = 0;
    let toPaddleBoardId = 0;
    let newGameBoard = { ...gameBoard };

    //Move marble from start
    if (fromPosition.indexOf("start") >= 0) {
      if (constants.CARDS.EXIT_START.includes(cardValue)) {
        toPosition = "track-9";

        //Update to and from positions
        newGameBoard[fromPaddleBoardId] = {
          ...newGameBoard[fromPaddleBoardId],
          [toPosition]: marble,
          [fromPosition]: {},
        };

        //Update board and UI
        dispatch(gameActions.updateGameBoard(newGameBoard));

        //Remove marble clickability
        dispatch(gameActions.setClickableMarbles([]));
        //End turn
        return;
      }
    }

    if (fromPosition.indexOf("track") !== -1) {
      //Determine direction
      const direction = constants.CARDS.MOVE_BACKWARD.includes(cardValue) ? -1 : 1;
      const cardNumericalValue = constants.CARDS.VALUES[cardValue];

      if (fromPositionValue + cardNumericalValue > constants.NUM_POSITIONS_PER_TRACK) {
        toPositionValue =
          fromPositionValue + cardNumericalValue - constants.NUM_POSITIONS_PER_TRACK;
        toPaddleBoardId = tko.getNextTrack(fromPaddleBoardId, game.players.length);
      } else {
        toPositionValue = fromPositionValue + cardNumericalValue;
        toPaddleBoardId = fromPaddleBoardId;
      }

      toPosition = `track-${toPositionValue}`;

      //Update from position
      newGameBoard[fromPaddleBoardId] = {
        ...newGameBoard[fromPaddleBoardId],
        [fromPosition]: {},
      };

      //Update to position
      newGameBoard[toPaddleBoardId] = {
        ...newGameBoard[toPaddleBoardId],
        [toPosition]: marble,
      };

      //Update board and UI
      dispatch(gameActions.updateGameBoard(newGameBoard));

      //Remove marble clickability
      dispatch(gameActions.setClickableMarbles([]));
    }
  };

  return (
    <div className={className} onClick={clickable ? marbleClickHandler : undefined}>
      {label}
    </div>
  );
}

export default PlayerPaddleItem;
