import { useSelector } from "react-redux";

import PlayerCardTable from "./Player/PlayerCardTable";

const CardTable = () => {
  const players = useSelector((state) => state.game.players);

  return (
    <>
      {players.map((player, index) => {
        return <PlayerCardTable player={player} key={index} players={players} />;
      })}
    </>
  );
};

export default CardTable;
