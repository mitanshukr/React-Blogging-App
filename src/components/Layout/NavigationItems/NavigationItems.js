import NavigationItem from "./NavigationItem/NavigationItem";

const navigationItems = (props) => {
  return (
    <ul>
      <NavigationItem link="/" exact>
        Home
      </NavigationItem>
      <NavigationItem link="/feed" exact>
        Feed
      </NavigationItem>
      {props.isAuthenticated ? (
        <>
          <NavigationItem link="/posts">Posts</NavigationItem>
          {props.children} {/* User Menu */}
        </>
      ) : (
        <>
          <NavigationItem link="/login" prevPath={props.prevPath}>
            Login
          </NavigationItem>
          <NavigationItem link="/signup">Signup</NavigationItem>
        </>
      )}
    </ul>
  );
};

export default navigationItems;
