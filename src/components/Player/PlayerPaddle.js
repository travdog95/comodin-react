import constants from "../../helpers/constants";
import PlayerPaddleItem from "./PlayerPaddleItem";

const PlayerPaddle = (props) => {
  const player = props.player;
  const rotation = props.game.players.length === 2 && player.id === 1 ? "rotate-180" : "";
  const classNames = `paddle ${rotation}`;
  return (
    <div className={classNames}>
      {constants.PADDLE_ITEMS.map((item, index) => {
        return <PlayerPaddleItem item={item} key={index} paddleBoard={player} game={props.game} />;
      })}
    </div>
  );
};

export default PlayerPaddle;
