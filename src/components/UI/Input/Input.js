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
            {props.required ? (
              <span className={classes.required}>*</span>
            ) : null}
          </label>
          <input
            className={props.errorMsg ? classes.error : ""}
            id={props.label}
            onChange={props.onChange}
            onBlur={props.onBlur}
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
            {props.required ? (
              <span className={classes.required}>*</span>
            ) : null}
          </label>
          <textarea
            className={props.errorMsg ? classes.error : ""}
            id={props.label}
            onChange={props.onChange}
            onBlur={props.onBlur}
            defaultValue={props.value}
            {...props.elementConfig}
          />
          <small className={classes.errorMsg}>{props.errorMsg}</small>
        </>
      );
      break;
    case "radio":
      inputElement = (
        <div onChange={props.onChange} className={classes.RadioBtn}>
          <p>
            {props.label}
            {props.required ? (
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
            {props.required ? (
              <span className={classes.required}>*</span>
            ) : null}
          </label>
          <input
            className={props.errorMsg ? classes.error : ""}
            id={props.label}
            onChange={props.onChange}
            value={props.value}
            {...props.elementConfig}
          />
          <small className={classes.errorMsg}>{props.errorMsg}</small>
        </>
      );
  }

  return <div className={classes.InputComponent}>{inputElement}</div>;
};

export default input;
