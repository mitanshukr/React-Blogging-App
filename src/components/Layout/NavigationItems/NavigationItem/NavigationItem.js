import { NavLink } from "react-router-dom";

const navigationItem = (props) => {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <NavLink
        exact
        style={{ ...props.style }}
        onClick={props.onClick}
        activeClassName="activeNav"
        to={{
          pathname: props.link,
          state: {
            prevPath: props.prevPath,
          },
        }}
      >
        {props.children}
      </NavLink>
    </li>
  );
};

export default navigationItem;
