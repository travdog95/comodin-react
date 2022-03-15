import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { gameActions } from "./store/game-reducer";
import { uiActions } from "./store/ui-reducer";
// import { createGame } from "./store/game-actions";

import "./css/main.css";
import "./css/_variables.css";

import Modal from "./components/UI/Modal";
import GameBoard from "./components/GameBoard";
import CardTable from "./components/CardTable";
import EventsContainer from "./components/EventsContainer";
import ChatContainer from "./components/ChatContainer";
import Footer from "./components/Footer";
import Notification from "./components/UI/Notification";

import constants from "./helpers/constants";
import tko from "./helpers/utilities";

const App = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.ui.modal);
  const notification = useSelector((state) => state.ui.notification);

  const settings = {
    playerNames: ["Travis", "Kimmo"],
    maxCardsInHand: 5,
  };

  const [isLoading, setIsLoading] = useState(true);

  const createGame = async () => {
    let gameBoard = {};
    const promises = settings.playerNames.map(async (playerName, index) => {
      const playerId = index + 1;
      gameBoard[playerId] = {};
      //Get new deck from card API
      const deck_id = await tko.newDeck(1);
      const deck = { id: deck_id, numDecks: 1 };

      //Build player hand
      const hand = await tko.drawCards(deck_id, settings.maxCardsInHand);

      //Build gameBoard
      constants.PADDLE_ITEMS.forEach((item) => {
        if (item.position) {
          gameBoard[playerId][item.position] = {};
        }
      });

      //Default marble positions
      const marbles = constants.MARBLES.START_POSITIONS.map((marblePosition, index) => {
        gameBoard[playerId][marblePosition] = { playerId, id: index + 1 };
        return {
          paddleBoardId: playerId,
          position: marblePosition,
        };
      });

      return {
        id: playerId,
        screenName: playerName,
        settings,
        color: constants.MARBLES.COLORS[index],
        deck,
        hand,
        marbles,
        discardedCard: {},
      };
    });

    const players = await Promise.all(promises);

    const game = {
      id: Date.now(),
      settings,
      players,
      // turnOrder: players.map((player) => player.id),
      gameBoard,
    };

    return game;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const game = await createGame(settings);
      console.log(game);
      dispatch(gameActions.updateGameBoard(game.gameBoard));
      dispatch(gameActions.setPlayers(game.players));
      dispatch(gameActions.setSettings(settings));

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
          <GameBoard />
          {notification && <Notification type={notification.type} message={notification.message} />}
          <CardTable />
        </div>
        <ChatContainer />
      </div>
      <Footer />
    </>
  );
};

export default App;
