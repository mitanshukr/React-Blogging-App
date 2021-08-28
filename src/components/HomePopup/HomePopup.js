import Backdrop from "../UI/Backdrop/Backdrop";
import classes from "./HomePopup.module.css";

const HomePopup = (props) => {
  return (
    <>
      <Backdrop visibility={true} clicked={props.clicked} />
      <div className={classes.HomePopup}>popup here!</div>
    </>
  );
};

export default HomePopup;
