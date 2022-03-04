import { useSelector } from "react-redux";

function MessageContainer() {
  const message = useSelector((state) => state.ui.sendMessage);

  return <div className="message-container">{message && message.message}</div>;
}

export default MessageContainer;
