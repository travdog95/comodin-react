import { useSelector } from "react-redux";

function PlayerPaddleItem(props) {
  const moveableMarbles = useSelector((state) => state.game.moveableMarbles);
  const clickableMarbles = useSelector((state) => state.game.clickableMarbles);

  const item = props.item;
  // const game = props.game;
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
        // console.log("clickable", clickableMarbles);
        //Highlight clickable marble
        clickableMarbles.forEach((clickableMarble) => {
          if (
            clickableMarble.position === item.position &&
            clickableMarble.paddleBoardPlayerId === paddleBoardPlayer.id
          ) {
            className += " clickable";
          }
        });
      }
    });
  }

  return <div className={className}>{label}</div>;
}

export default PlayerPaddleItem;
