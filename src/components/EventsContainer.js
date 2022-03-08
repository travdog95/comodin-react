import { useSelector } from "react-redux";

import Event from "./Event";
const EventsContainer = () => {
  const events = useSelector((state) => state.ui.auditEvents);

  return (
    <div className="events-container">
      {events.map((event, index) => {
        return <Event event={event} key={index} />;
      })}
    </div>
  );
};

export default EventsContainer;
