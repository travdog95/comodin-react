import constants from "../../helpers/constants";
import PlayerPaddleItem from "./PlayerPaddleItem";

function PlayerPaddle(props) {
  const player = props.player;
  return (
    <div className="paddle" data-paddle={player.id}>
      {constants.PADDLE_ITEMS.map((item, index) => {
        return <PlayerPaddleItem item={item} key={index} />;
      })}
    </div>
  );
}

export default PlayerPaddle;
