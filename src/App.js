import { useState, useEffect } from "react";
import "./css/main.css";
import GameBoard from "./components/GameBoard";
import MessageContainer from "./components/MessageContainer";
import CardTable from "./components/CardTable";
import EventsContainer from "./components/EventsContainer";
import ChatContainer from "./components/ChatContainer";
import Footer from "./components/Footer";
import Game from "./models/game";

function App() {
  const settings = {
    playerNames: ["Travis", "Kimmo"],
    maxCardsInHand: 5,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState({});

  useEffect(async () => {
    setIsLoading(true);
    const game = new Game(settings);
    await game.startNewGame();
    console.log(game);
    setGame(game);
    setIsLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="title">Jokers & Marbles</div>
      </header>
      <div className="app-container">
        <EventsContainer />
        <div className="game-container">
          <GameBoard game={game} />
          <MessageContainer />
          <CardTable game={game} />
        </div>
        <ChatContainer />
      </div>
      <Footer />
    </div>
  );
}

export default App;
