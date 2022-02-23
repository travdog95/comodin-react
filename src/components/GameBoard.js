import PlayerPaddle from "./PlayerPaddle";

function GameBoard(props) {
  const { playerNames, maxCardsInHand } = props.settings;
  return (
    <div className="game-board">
      {playerNames.map((playerName, index) => {
        const className = "";
        return <PlayerPaddle key={index} className={className} />;
      })}
    </div>
  );
}

export default GameBoard;
