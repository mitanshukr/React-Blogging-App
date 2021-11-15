import Backdrop from "../Backdrop/Backdrop";
import { IoClose } from "react-icons/io5";
import "./Modal.css";

const modal = (props) => {
  return (
    <>
      <Backdrop visibility={props.visibility} onClick={props.clicked} />
      <div
        className="Modal"
        style={{
          transform: !props.visibility
            ? "translate(-50%, -700px)"
            : "translate(-50%, 50px)",
          // opacity: props.visibility ? "1" : "0",
        }}
      >
        <IoClose
          title="Close"
          className="Modal__closeIcon"
          onClick={props.clicked}
        />
        {props.children}
      </div>
    </>
  );
};

export default modal;
