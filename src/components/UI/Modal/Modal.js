import Aux from "../../../hoc/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";
import { IoClose } from "react-icons/io5";
import "./Modal.css";

const modal = (props) => {
  return (
    <Aux>
      <Backdrop visibility={props.visibility} onClick={props.clicked} />
      <div
        className="Modal"
        style={{
          transform: !props.visibility ? "translateY(-200%)" : "",
          opacity: props.visibility ? "1" : "0",
        }}
      >
        <IoClose
          title="Close"
          className="Modal__closeIcon"
          onClick={props.clicked}
        />
        {props.children}
      </div>
    </Aux>
  );
};

export default modal;
