import Toolbar from "../Toolbar/Toolbar";
import Aux from "../../hoc/Auxiliary";

const layout = (props) => {
  return (
    <Aux>
      <Toolbar
        isAuthenticated={props.isAuthenticated}
        prevPath={props.prevPath}
      />
      {/* //sidedrawer */}
      <main style={{ height: "100%" }}>{props.children}</main>
    </Aux>
  );
};

export default layout;
