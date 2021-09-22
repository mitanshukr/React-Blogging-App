import classes from "./Button.module.css";

const button = (props) => {
  return (
    <button
      style={props.style}
      type={props.type}
      className={classes.Button}
      onClick={props.onClick}
      btntype={props.btnType}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default button;
