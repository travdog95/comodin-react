import { useSelector } from "react-redux";

import PlayerPaddle from "./Player/PlayerPaddle";
import classes from "./GameBoard.module.css";

function GameBoard() {
  const players = useSelector((state) => state.game.players);

  return (
    <div className={classes["game-board"]}>
      {players.map((player, index) => {
        return <PlayerPaddle key={index} player={player} />;
      })}
    </div>
  );
}

export default GameBoard;
