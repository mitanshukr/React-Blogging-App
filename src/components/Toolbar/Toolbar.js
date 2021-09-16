import { NavLink } from "react-router-dom";
import NavigationItems from "../Toolbar/NavigationItems/NavigationItems";
import "./Toolbar.css";

const toolbar = (props) => {
  return (
    <header className="Header">
      <div className="logo">
        <NavLink to="/" exact>
          Immune Ink
        </NavLink>
      </div>
      <nav>
        <NavigationItems isAuthenticated={props.isAuthenticated} />
        {/* togglerBtn */}
      </nav>
    </header>
  );
};

export default toolbar;
