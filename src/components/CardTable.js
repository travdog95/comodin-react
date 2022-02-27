import PlayerCardTable from "./Player/PlayerCardTable";

function CardTable(props) {
  const game = props.game;
  return (
    <div>
      {game.players.map((player, index) => {
        return <PlayerCardTable player={player} key={index} game={game} />;
      })}
    </div>
  );
}

export default CardTable;
