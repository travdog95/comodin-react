function PlayerPaddleItem(props) {
  const item = props.item;
  const game = props.game;
  const paddleBoardPlayer = props.paddleBoardPlayer;
  let className = `paddle-item ${item.class}`;
  const label = item.label ? item.label : "";

  game.players.forEach((player) => {
    player.marbles.forEach((marble) => {
      if (
        marble.position === item.position &&
        marble.paddleBoardPlayerId === paddleBoardPlayer.id
      ) {
        className += ` ${player.color}`;
      }
    });
  });

  return <div className={className}>{label}</div>;
}

export default PlayerPaddleItem;
