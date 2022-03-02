import PlayerPaddle from "./Player/PlayerPaddle";
import Button from "./UI/Button";

function GameBoard(props) {
  const players = props.game.players;

  return (
    <div className="game-board">
      <Button onClick={props.onClickShowModal}>Display Modal</Button>
      {players.map((player, index) => {
        return <PlayerPaddle key={index} player={player} game={props.game} />;
      })}
    </div>
  );
}

export default GameBoard;
