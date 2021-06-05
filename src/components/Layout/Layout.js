import Toolbar from "../Toolbar/Toolbar";
import Aux from "../../hoc/Auxiliary";

const layout = (props) => {
  return (
    <Aux>
      <Toolbar isAuthenticated={props.isAuthenticated}/>
      {/* //sidedrawer */}
      <main>{props.children}</main>
    </Aux>
  );
};

export default layout;
