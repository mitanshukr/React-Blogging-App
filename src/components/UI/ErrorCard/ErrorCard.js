import classes from "./ErrorCard.module.css";

const ErrorCard = (props) => (
  <div className={classes.ErrorCard}>
    <div className={classes.ErrorCard__msg}>{props.children}</div>
  </div>
);

export default ErrorCard;
