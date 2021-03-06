import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { uiActions } from "./store/ui-reducer";
import { createGame } from "./store/game-actions";

import "./Apps.css";
import "./css/_variables.css";
import "./css/_utilities.css";

import Modal from "./components/UI/Modal/Modal";
import GameBoard from "./components/GameBoard";
import CardTable from "./components/CardTable";
import EventsContainer from "./components/EventsContainer";
import ChatContainer from "./components/ChatContainer";
import Footer from "./components/Footer";

const App = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.ui.modal);

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
      <ToastContainer position="top-right" draggable={false} theme="dark" pauseOnHover={false} />
      <header className="header">
        <div className="title">Jokers & Marbles</div>
      </header>
      <div className="app-container">
        <EventsContainer />
        <div className="game-container">
          <GameBoard />
          <CardTable />
        </div>
        <ChatContainer />
      </div>
      <Footer />
    </>
  );
};

export default App;
