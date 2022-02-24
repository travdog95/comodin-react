function PlayerPaddleItem(props) {
  const item = props.item;
  const className = `paddle-item ${item.class}`;
  const label = item.label ? item.label : "";

  return <div className={className}>{label}</div>;
}

export default PlayerPaddleItem;
