import classes from "./Button.module.css";

const button = props => {
    return <button type={props.type} className={classes.Button} onClick={props.onClick} btntype={props.btnType}>{props.children}</button>
}

export default button;