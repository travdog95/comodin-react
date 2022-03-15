import { useSelector } from "react-redux";

import constants from "../../helpers/constants";

import PlayerPaddleItem from "./PlayerPaddleItem";

const PlayerPaddle = (props) => {
  const players = useSelector((state) => state.game.players);

  const { player } = props;
  const rotation = players.length === 2 && player.id === 1 ? "rotate-180" : "";
  const classNames = `paddle ${rotation}`;
  return (
    <div className={classNames}>
      {constants.PADDLE_ITEMS.map((item, index) => {
        return <PlayerPaddleItem item={item} key={index} paddleBoardId={player.id} />;
      })}
    </div>
  );
};

export default PlayerPaddle;
