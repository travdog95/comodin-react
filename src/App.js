import "./css/main.css";
import GameBoard from "./components/GameBoard";
import MessageContainer from "./components/MessageContainer";
import CardTable from "./components/CardTable";
import AuditContainer from "./components/AuditContainer";
import Game from "./models/game";

function App() {
  const settings = {
    playerNames: ["Travis", "Kimmo"],
    maxCardsInHand: 5,
  };

  const game = new Game(settings);
  game.startNewGame();

  console.log(game);

  return (
    <div className="App">
      <header className="header">
        <div className="title">Jokers & Marbles</div>
      </header>
      <GameBoard settings={settings} />
      <MessageContainer />
      <CardTable />
      <AuditContainer />
    </div>
  );
}

export default App;
