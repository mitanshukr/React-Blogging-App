import classes from './AuthCard.module.css';

const AuthCard = (props) => {
  return <div className={classes.AuthCard}>{props.children}</div>;
};

export default AuthCard;
