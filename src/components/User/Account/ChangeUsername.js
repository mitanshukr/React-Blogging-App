import Aux from "../../../hoc/Auxiliary";
import Button from "../../UI/Button/Button";
import ErrorCard from "../../UI/ErrorCard/ErrorCard";
import Input from "../../UI/Input/Input";
import classes from "./ChangeUsername.module.css";

const ChangeUsername = (props) => {
  const formElements = Object.keys(props.formData).map((element) => {
    return (
      <Aux key={element}>
        <Input
          elementType={props.formData[element].elementType}
          elementConfig={{
            ...props.formData[element].elementConfig,
            style: props.isUsernameAvailable
              ? { border: "1px solid green" }
              : null,
          }}
          value={props.formData[element].value}
          label={props.formData[element].label}
          onChange={props.onChange}
          errorMsg={props.formData[element].validation.errorMsg}
          required={props.formData[element].validation.required}
          onBlur={props.onBlur}
        />
      </Aux>
    );
  });
  return (
    <div className={classes.CreatePost}>
      <h3>{props.title}</h3>
      <form onSubmit={props.onSubmit}>
        <ErrorCard>{props.errorMsg}</ErrorCard>
        {formElements}
        <small
          className={classes.CreatePost__availStatus}
          style={props.isUsernameAvailable ? { color: "green" } : null}
        >
          {!props.formData.userName.validation.errorMsg &&
            props.formData.userName.value &&
            (props.isUsernameAvailable
              ? "Username Available!"
              : props.isUsernameAvailable === null
              ? "Checking Availability..."
              : null)}
        </small>
        <div className={classes.Button}>
          <Button
            type="button"
            onClick={props.cancelClicked}
            disabled={props.serverBusy}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={props.serverBusy}>
            {props.serverBusy ? "Please wait..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangeUsername;
