// import MenuList from "../../../container/Layout/Toolbar/UserMenu/MenuList/MenuList";
import ProfileIcon from "../../User/Profile/ProfileIcon";

const SidebarNavigationItems = (props) => {
  return (
    <div>
      <ul>
        {/* <li>Home</li>
        <li>Feed</li>
        <li>Login</li>
        <li>Signup</li> */}
        <li>
          <ProfileIcon firstLetter="M" lastLetter="K" />
          Your Profile
        </li>

        <li>Feed</li>
        <li>Your Posts</li>
        <li>Saved Items</li>
        <li>Account</li>
        <li>Feedback</li>
        <li>Logout</li>
        <p style={{ color: "red", fontWeight: "bold" }}>
          Note: Mobile Nav Menu is under developement, please Check back later.
          you can use Desktop screens to access Menu options for now. Thank you!
        </p>
        {/* <MenuList/> */}
      </ul>
    </div>
  );
};

export default SidebarNavigationItems;
