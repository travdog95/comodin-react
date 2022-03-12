import PlayerPaddle from "./Player/PlayerPaddle";
import classes from "./GameBoard.module.css";

function GameBoard(props) {
  const players = props.game.players;

  return (
    <div className={classes["game-board"]}>
      {players.map((player, index) => {
        return <PlayerPaddle key={index} player={player} game={props.game} />;
      })}
    </div>
  );
}

export default GameBoard;
