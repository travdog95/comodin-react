import { useSelector, useDispatch } from "react-redux";

import { gameActions, uiActions } from "../../store/index";
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
    let toPosition = "";
    let newGameBoard = { ...gameBoard };
    //Move marble from start
    if (item.position.indexOf("start") >= 0) {
      if (constants.CARDS.EXIT_START.includes(discardedCard.value)) {
        toPosition = "track-9";

        //Update to and from positions
        newGameBoard[paddleBoardPlayer.id] = {
          ...newGameBoard[paddleBoardPlayer.id],
          [toPosition]: marble,
          [item.position]: {},
        };

        //Update board and UI
        dispatch(gameActions.updateGameBoard(newGameBoard));

        //Remove marble clickability
        dispatch(gameActions.setClickableMarbles([]));
        //End turn
        return;
      }
    }
  };

  return (
    <div className={className} onClick={clickable ? marbleClickHandler : undefined}>
      {label}
    </div>
  );
}

export default PlayerPaddleItem;
