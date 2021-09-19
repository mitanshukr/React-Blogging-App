import Aux from "../../../hoc/Auxiliary";
import classes from "./Input.module.css";

const input = (props) => {
  let inputElement = null;
  switch (props.elementType) {
    case "input":
      inputElement = (
        <>
          <label htmlFor={props.label}>
            {props.label}
            {props.elementConfig.required ? (
              <span className={classes.required}>*</span>
            ) : null}
          </label>
          <input
            // className={classes.error}
            id={props.label}
            onChange={props.onChange}
            value={props.value}
            {...props.elementConfig}
          />
          <small className={classes.errorMsg}>{props.errorMsg}</small>
        </>
      );
      break;
    case "textarea":
      inputElement = (
        <>
          <label htmlFor={props.label}>
            {props.label}
            {props.elementConfig.required ? (
              <span className={classes.required}>*</span>
            ) : null}
          </label>
          <textarea
            // className={classes.error}
            id={props.label}
            onChange={props.onChange}
            defaultValue={props.value}
            {...props.elementConfig}
          />
        </>
      );
      break;
    case "radio":
      inputElement = (
        <div onChange={props.onChange} className={classes.RadioBtn}>
          <p>
            {props.label}
            {props.elementConfig.required ? (
              <span className={classes.required}>*</span>
            ) : null}
          </p>
          {props.elementConfig.options.map((obj) => {
            return (
              <span key={obj.value}>
                <input
                  type="radio"
                  name={props.elementConfig.name}
                  id={obj.displayValue}
                  defaultChecked={obj.checked}
                  value={obj.value}
                />
                <label htmlFor={obj.displayValue}>{obj.displayValue}</label>
              </span>
            );
          })}
        </div>
      );
      break;
    default:
      inputElement = (
        <>
          <label htmlFor={props.label}>
            {props.label}
            {props.elementConfig.required ? (
              <span className={classes.required}>*</span>
            ) : null}
          </label>
          <input
            // className={classes.error}
            id={props.label}
            onChange={props.onChange}
            value={props.value}
            {...props.elementConfig}
          />
        </>
      );
  }

  return <div className={classes.InputComponent}>{inputElement}</div>;
};

export default input;
