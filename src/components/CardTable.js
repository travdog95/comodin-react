import PlayerHand from "./Player/PlayerHand";

function CardTable(props) {
  const game = props.game;
  return (
    <div>
      {game.players.map((player, index) => {
        const playerIconClasses = `player-icon ${player.color}`;
        return (
          <div className="player-card-table" data-deck-container key={index}>
            <div className="player-info">
              <div className="player-name">{player.screenName}</div>
              <div className={playerIconClasses} data-player-icon></div>
            </div>
            <div className="deck" data-player-deck>
              <div className="draw-pile" data-draw-pile>
                <img src={require("../img/back.png")} alt="Draw Pile" />
              </div>
              <div className="discard-pile" data-discard-pile></div>
              <div className="hand" data-hand>
                {player.hand.map((card, index) => {
                  return <PlayerHand key={index} card={card} />;
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CardTable;
