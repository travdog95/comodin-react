import { useSelector } from "react-redux";

function PlayerPaddleItem(props) {
  const moveableMarbles = useSelector((state) => state.game.moveableMarbles);
  const clickableMarbles = useSelector((state) => state.game.clickableMarbles);
  let clickable = false;

  const item = props.item;
  const paddleBoardPlayer = props.paddleBoardPlayer;
  let className = `paddle-item ${item.class}`;
  const label = item.label ? item.label : "";

  // If position on board
  if (item.position) {
    paddleBoardPlayer.marbles.forEach((marble) => {
      //Place marble
      if (
        marble.position === item.position &&
        marble.paddleBoardPlayerId === paddleBoardPlayer.id
      ) {
        className += ` ${paddleBoardPlayer.color}`;

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
    });
  }

  const marbleClickHandler = (e) => {
    const marbleElement = e.target;

    console.log(marbleElement);
    // if (marbleElement.dataset.start) {
    //   if (constants.CARDS.EXIT_START.includes(card.value)) {
    //     //Update marbles property
    //     toPosition = `${this.id}-9`;
    //     this.marbles[marbleNum] = toPosition;
    //     //End turn
    //     this.endTurn();
    //     return;
    //   }
    // }
  };

  return (
    <div className={className} onClick={clickable ? marbleClickHandler : undefined}>
      {label}
    </div>
  );
}

export default PlayerPaddleItem;
