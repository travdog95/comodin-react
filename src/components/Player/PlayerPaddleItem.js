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
  const paddleBoard = props.paddleBoard;
  let className = `paddle-item ${item.class}`;
  const label = item.label ? item.label : "";
  let marble = {};

  // If position on board
  if (item.position) {
    //If position has a marble
    if (Object.keys(gameBoard[paddleBoard.id][item.position]).length > 0) {
      marble = gameBoard[paddleBoard.id][item.position];
      const marblePlayer = tko.getPlayerById(game.players, marble.playerId);
      className += ` ${marblePlayer.color}`;

      //Highlight moveable marble
      moveableMarbles.forEach((moveableMarble) => {
        if (
          moveableMarble.position === item.position &&
          moveableMarble.paddleBoardId === paddleBoard.id
        ) {
          className += " moveable";
        }
      });

      //Highlight clickable marble
      clickableMarbles.forEach((clickableMarble) => {
        if (
          clickableMarble.position === item.position &&
          clickableMarble.paddleBoardId === paddleBoard.id
        ) {
          className += " clickable";
          clickable = true;
        }
      });
    }
  }

  const marbleClickHandler = (e) => {
    const from = {
      position: item.position,
      positionValue: tko.getMarblePositionValue(item.position),
      paddleBoardId: paddleBoard.id,
    };
    let to = {};
    const cardValue = discardedCard.value;
    let newGameBoard = { ...gameBoard };

    //Move marble from start
    if (from.position.indexOf("start") >= 0) {
      if (constants.CARDS.EXIT_START.includes(cardValue)) {
        //Update to and from positions
        newGameBoard[from.paddleBoardId] = {
          ...newGameBoard[from.paddleBoardId],
          [constants.TRACK.EXIT]: marble,
          [from.position]: {},
        };

        //Update board and UI
        dispatch(gameActions.updateGameBoard(newGameBoard));

        //Remove marble clickability
        dispatch(gameActions.setClickableMarbles([]));

        //Draw card

        //End turn
        return;
      }
    }

    if (from.position.indexOf("track") !== -1) {
      //Determine direction
      const direction = constants.CARDS.MOVE_BACKWARD.includes(cardValue) ? -1 : 1;
      const cardNumericalValue = constants.CARDS.VALUES[cardValue];

      if (direction === 1) {
        to = tko.moveMarbleForward(from, cardNumericalValue, gameBoard);
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
