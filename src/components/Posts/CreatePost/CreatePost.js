import Aux from "../../../hoc/Auxiliary";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import classes from "./CreatePost.module.css";

const createPost = (props) => {
  const formElement = Object.keys(props.formData).map((element) => {
    if (element === "body") return null;
    return (
      <Aux key={element}>
        <label>{element === "isPrivate" ? "Keep it Secret?" : element}</label>
        <Input
          elementType={props.formData[element].elementType}
          elementConfig={props.formData[element].elementConfig}
          value={props.formData[element].value}
          onChange={props.onChange}
        />
      </Aux>
    );
  });
  return (
    <div className={classes.CreatePost}>
      <h3>Create Post</h3>
      <form onSubmit={props.onSubmit}>
        {formElement}
        <div className={classes.Button}>
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={props.cancelClicked}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default createPost;
