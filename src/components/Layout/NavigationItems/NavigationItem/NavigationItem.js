import { NavLink } from "react-router-dom";

const navigationItem = (props) => {
  return (
    <li>
      <NavLink
        exact
        onClick={props.onClick}
        // activeClassName="active"
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
