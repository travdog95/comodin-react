import PlayerPaddle from "./Player/PlayerPaddle";

function GameBoard(props) {
  const players = props.game.players;

  return (
    <div className="game-board">
      {players.map((player, index) => {
        return <PlayerPaddle key={index} player={player} game={props.game} />;
      })}
    </div>
  );
}

export default GameBoard;
