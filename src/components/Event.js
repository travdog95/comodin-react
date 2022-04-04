import classes from "./Event.module.css";

const Event = (props) => {
  const { event, index } = props;
  const rowBand = index % 2 === 0 ? classes.even : classes.odd;
  return <div className={`${classes.event} ${rowBand}`}>{event}</div>;
};

export default Event;
