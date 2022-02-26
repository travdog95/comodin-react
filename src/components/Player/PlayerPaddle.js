import constants from "../../helpers/constants";
import PlayerPaddleItem from "./PlayerPaddleItem";

const PlayerPaddle = (props) => {
  const player = props.player;
  return (
    <div className="paddle">
      {constants.PADDLE_ITEMS.map((item, index) => {
        return (
          <PlayerPaddleItem item={item} key={index} paddleBoardPlayer={player} game={props.game} />
        );
      })}
    </div>
  );
};

export default PlayerPaddle;
