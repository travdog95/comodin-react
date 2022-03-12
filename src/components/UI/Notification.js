import classes from "./Notification.module.css";
import constants from "../../helpers/constants";

const Notification = (props) => {
  const type = constants.NOTIFICATION_TYPES.includes(props.type) ? props.type : "primary";
  const specialClasses = classes[type];

  const cssClasses = `${classes.notification} ${specialClasses}`;

  return <div className={cssClasses}>{props.message}</div>;
};

export default Notification;
