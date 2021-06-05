import NavigationItem from "./NavigationItem/NavigationItem";
import UserMenu from '../../../container/User/UserMenu/UserMenu';
import MenuIcon from "../../../container/User/UserMenu/MenuIcon/MenuIcon";

const navigationItems = (props) => {
  let navItems;

  if (props.isAuthenticated) {
    navItems = (
      <ul>
        <NavigationItem link="/" exact>Home</NavigationItem>
        <NavigationItem link="/feed" exact>Feed</NavigationItem>
        <NavigationItem link="/posts">Posts</NavigationItem>
        <MenuIcon />
        <UserMenu />
      </ul>
    );
  } else {
    navItems = (
      <ul>
        <NavigationItem link="/" exact>Home</NavigationItem>
        <NavigationItem link="/feed" exact>Feed</NavigationItem>
        <NavigationItem link="/login">Login</NavigationItem>
        <NavigationItem link="/signup">Signup</NavigationItem>
      </ul>
    );
  }

  return navItems;
};

export default navigationItems;
