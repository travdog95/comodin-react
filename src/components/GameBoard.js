import { useDispatch } from "react-redux";

import { uiActions } from "../store/index";

import PlayerPaddle from "./Player/PlayerPaddle";
import Button from "./UI/Button";

function GameBoard(props) {
  const dispatch = useDispatch();

  const players = props.game.players;

  const onClickHandler = () => {
    dispatch(uiActions.showModal({ title: "Fancy Title", message: "Fancy message" }));
  };

  return (
    <div className="game-board">
      <Button onClick={onClickHandler}>Display Modal</Button>
      {players.map((player, index) => {
        return <PlayerPaddle key={index} player={player} game={props.game} />;
      })}
    </div>
  );
}

export default GameBoard;
