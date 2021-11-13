import "./Backdrop.css";

const backdrop = (props) => {
  return props.visibility ? (
    <div
      onClick={props.onClick}
      className="Backdrop"
      style={{ ...props.style }}
    ></div>
  ) : null;
};

export default backdrop;
