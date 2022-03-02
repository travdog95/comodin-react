import PlayerCardTable from "./Player/PlayerCardTable";

function CardTable(props) {
  const game = props.game;
  return (
    <>
      {game.players.map((player, index) => {
        return <PlayerCardTable player={player} key={index} game={game} />;
      })}
    </>
  );
}

export default CardTable;
