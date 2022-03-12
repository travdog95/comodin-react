import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "./store/game-reducer";
import { uiActions } from "./store/ui-reducer";

import "./css/main.css";
import "./css/_variables.css";

import Modal from "./components/UI/Modal";
import GameBoard from "./components/GameBoard";
import CardTable from "./components/CardTable";
import EventsContainer from "./components/EventsContainer";
import ChatContainer from "./components/ChatContainer";
import Footer from "./components/Footer";
import Notification from "./components/UI/Notification";

import Game from "./models/game";
import Player from "./models/player";
import Deck from "./models/deck";
import constants from "./helpers/constants";

function App() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.ui.modal);
  const notification = useSelector((state) => state.ui.notification);

  const settings = {
    playerNames: ["Travis", "Kimmo"],
    maxCardsInHand: 5,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState({});

  const createGame = async () => {
    let gameBoard = {};
    const promises = settings.playerNames.map(async (playerName, index) => {
      const playerId = index + 1;
      gameBoard[playerId] = {};
      //Get new deck from card API
      const deck_id = await newDeck(1);

      //Create new deck instance
      const deck = new Deck(1, deck_id);

      const hand = await deck.drawCards(settings.maxCardsInHand);

      //Build gameBoard
      constants.PADDLE_ITEMS.forEach((item) => {
        if (item.position) {
          gameBoard[playerId][item.position] = {};
        }
      });

      const marbles = constants.MARBLES.START_POSITIONS.map((marblePosition, index) => {
        gameBoard[playerId][marblePosition] = { playerId, id: index + 1 };
        return {
          paddleBoardId: playerId,
          position: marblePosition,
        };
      });

      return new Player(
        playerId,
        playerName,
        settings,
        constants.MARBLES.COLORS[index],
        deck,
        hand,
        marbles
      );
    });

    const players = await Promise.all(promises);

    const game = new Game(players, gameBoard, settings);

    return game;
  };

  const newDeck = async (numberOfDecks) => {
    const response = await fetch(
      `${constants.DECK_OF_CARDS_API}new/shuffle/?deck_count=${numberOfDecks}&jokers_enabled=true`
    );

    if (response.status >= 200 && response.status <= 299) {
      const data = await response.json();
      return data.deck_id;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const game = await createGame(settings);
      console.log(game);
      dispatch(gameActions.updateGameBoard(game.gameBoard));
      setGame(game);
      setIsLoading(false);
    };
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  const closeModalHandler = () => {
    dispatch(uiActions.showModal(null));
  };

  return (
    <>
      {modal && <Modal title={modal.title} message={modal.message} onConfirm={closeModalHandler} />}

      <header className="header">
        <div className="title">Jokers & Marbles</div>
      </header>
      <div className="app-container">
        <EventsContainer />
        <div className="game-container">
          <GameBoard game={game} />
          {notification && <Notification type={notification.type} message={notification.message} />}
          <CardTable game={game} />
        </div>
        <ChatContainer />
      </div>
      <Footer />
    </>
  );
}

export default App;
