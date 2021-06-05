import { NavLink } from "react-router-dom";

const navigationItem = props => {
    return (
        <li>
            <NavLink exact onClick={props.onClick} activeClassName='active' to={props.link}>{props.children}</NavLink>
        </li>
    )
}

export default navigationItem;