import Aux from "../../../hoc/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";
import "./Modal.css";

const modal = (props) => {
  return (
    <Aux>
      <Backdrop visibility={props.visibility} clicked={props.clicked} />
      <div
        className="Modal"
        style={{
          transform: !props.visibility
            ? "translateY(-200%)"
            : '',
          opacity: props.visibility ? "1" : "0",
        }}
      >
        {props.children}
      </div>
    </Aux>
  );
};

export default modal;
