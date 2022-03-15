import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { uiActions } from "./store/ui-reducer";
import { createGame } from "./store/game-actions";

import "./css/main.css";
import "./css/_variables.css";

import Modal from "./components/UI/Modal";
import GameBoard from "./components/GameBoard";
import CardTable from "./components/CardTable";
import EventsContainer from "./components/EventsContainer";
import ChatContainer from "./components/ChatContainer";
import Footer from "./components/Footer";
import Notification from "./components/UI/Notification";

const App = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.ui.modal);
  const notification = useSelector((state) => state.ui.notification);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      createGame({
        playerNames: ["Travis", "Kimmo"],
        maxCardsInHand: 5,
      })
    );
    setIsLoading(false);
  }, [dispatch]);

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
