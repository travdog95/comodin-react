import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "../../store/game-reducer";
import { setNextPlayerId, updatePlayer } from "../../store/game-actions";
import classes from "./PlayerPaddleItem.module.css";

import constants from "../../helpers/constants";
import tko from "../../helpers/utilities";

const PlayerPaddleItem = (props) => {
  const dispatch = useDispatch();

  const { item, paddleBoardId } = props;

  const moveableMarbles = useSelector((state) => state.game.moveableMarbles);
  const clickableMarbles = useSelector((state) => state.game.clickableMarbles);
  const gameBoard = useSelector((state) => state.game.gameBoard);
  const players = useSelector((state) => state.game.players);

  let marbleColorClass = "";
  let isMoveable = false;
  let isClickable = false;
  const label = item.label ? item.label : "";
  let marble = {};
  let marblePlayer = {};

  // If position on board
  if (item.position) {
    //If position has a marble
    if (Object.keys(gameBoard[paddleBoardId][item.position]).length > 0) {
      marble = gameBoard[paddleBoardId][item.position];
      marblePlayer = tko.getPlayerById(players, marble.playerId);
      marbleColorClass = `${marblePlayer.color}`;

      //Highlight moveable marble
      moveableMarbles.forEach((moveableMarble) => {
        if (
          moveableMarble.position === item.position &&
          moveableMarble.paddleBoardId === paddleBoardId
        ) {
          isMoveable = true;
        }
      });

      //Highlight clickable marble
      clickableMarbles.forEach((clickableMarble) => {
        if (
          clickableMarble.position === item.position &&
          clickableMarble.paddleBoardId === paddleBoardId
        ) {
          isClickable = true;
        }
      });
    }
  }

  const marbleClickHandler = async () => {
    const from = {
      position: item.position,
      positionValue: tko.getMarblePositionValue(item.position),
      paddleBoardId: paddleBoardId,
    };
    let to = {};
    const cardValue = marblePlayer.discardedCard.value;
    let newGameBoard = { ...gameBoard };
    let auditEvents = [];

    //Move marble from start
    if (from.position.indexOf("start") >= 0 && constants.CARDS.EXIT_START.includes(cardValue)) {
      //Update to and from positions
      newGameBoard[from.paddleBoardId] = {
        ...newGameBoard[from.paddleBoardId],
        [constants.TRACK.EXIT]: marble,
        [from.position]: {},
      };

      auditEvents.push(`${marblePlayer.screenName} moved marble out of start`);

      //Check to see if marble is in start exit
      const startPosition = {
        paddleBoardId: from.paddleBoardId,
        position: constants.TRACK.EXIT,
      };
      const displacedMarble = tko.getDisplacedMarble(gameBoard, startPosition);

      if (Object.keys(displacedMarble).length > 0) {
        newGameBoard = tko.placeDisplacedMarble(newGameBoard, displacedMarble);

        const displacedMarblePlayer = tko.getPlayerById(players, displacedMarble.playerId);

        auditEvents.push(
          `${marblePlayer.screenName} sent ${displacedMarblePlayer.screenName}'s marble to start.`
        );
      }
    }

    //If marble is on track or home
    if (from.position.indexOf("start") === -1) {
      //Determine direction
      const direction = constants.CARDS.MOVE_BACKWARDS.includes(cardValue) ? -1 : 1;
      const directionText = direction === 1 ? "forwards" : "backwards";
      const cardNumericalValue = constants.CARDS.VALUES[cardValue];

      to = tko.moveMarble(marblePlayer, from, direction, cardNumericalValue, gameBoard);

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

      //Add audit event
      auditEvents.push(
        `${marblePlayer.screenName} moved marble ${directionText} ${cardNumericalValue} spaces`
      );

      //Update displaced marble
      if (Object.keys(to.displacedMarble).length > 0) {
        newGameBoard = tko.placeDisplacedMarble(newGameBoard, to.displacedMarble);

        const displacedMarblePlayer = tko.getPlayerById(players, to.displacedMarble.playerId);

        auditEvents.push(
          `${marblePlayer.screenName} sent ${displacedMarblePlayer.screenName}'s marble to start.`
        );
      }
    }

    //Update board and UI
    dispatch(gameActions.updateGameBoard(newGameBoard));

    //Remove marble clickability
    dispatch(gameActions.setClickableMarbles([]));

    //Draw card
    const cards = await tko.drawCards(marblePlayer.deck.id, 1);

    //Add card to player's hand
    const newHand = [...marblePlayer.hand, cards[0]];
    const playerData = { ...marblePlayer, hand: newHand };

    //Update player data
    dispatch(updatePlayer(playerData, players));

    //Set next player's turn
    auditEvents.push(`${marblePlayer.screenName} drew a card.`);
    dispatch(setNextPlayerId(marblePlayer.id, players, auditEvents));
  };

  return (
    <div
      className={`${classes["paddle-item"]} ${classes[item.class]} ${marbleColorClass} ${
        isClickable && classes.clickable
      } ${isMoveable && classes.moveable}`}
      onClick={isClickable ? marbleClickHandler : undefined}
    >
      {label}
    </div>
  );
};

export default PlayerPaddleItem;
