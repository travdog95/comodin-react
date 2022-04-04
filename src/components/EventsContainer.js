import { useSelector } from "react-redux";

// import classes from "./EventsContainer.module.css";

import Event from "./Event";
const EventsContainer = () => {
  const events = useSelector((state) => state.ui.auditEvents);

  return (
    <div className="events-container">
      {events.map((event, index) => {
        return <Event event={event} key={index} index={index} />;
      })}
    </div>
  );
};

export default EventsContainer;
