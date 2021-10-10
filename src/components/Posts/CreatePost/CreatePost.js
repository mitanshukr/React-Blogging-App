import Aux from "../../../hoc/Auxiliary";
import Button from "../../UI/Button/Button";
import ErrorCard from "../../UI/ErrorCard/ErrorCard";
import Input from "../../UI/Input/Input";
import classes from "./CreatePost.module.css";

const CreatePost = (props) => {
  const formElement = Object.keys(props.formData).map((element) => {
    if (element === "body") return null;
    return (
      <Aux key={element}>
        <Input
          elementType={props.formData[element].elementType}
          elementConfig={props.formData[element].elementConfig}
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
      <h3>Create Post</h3>
      <form onSubmit={props.onSubmit}>
        <ErrorCard>{props.errorMsg}</ErrorCard>
        {formElement}
        <div className={classes.Button}>
          <Button type="submit" disabled={props.serverBusy}>
            {props.serverBusy ? "Please wait..." : "Submit"}
          </Button>
          <Button
            type="button"
            onClick={props.cancelClicked}
            disabled={props.serverBusy}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
