import classes from "./PostsListLayout.module.css";

const PostsListLayout = (props) => {
  return (
    <>
      <div
        className={classes.PostsList__banner}
        style={{ ...props.bannerStyle }}
      >
        <h1>{props.title}</h1>
        <p>{props.subtitle}</p>
      </div>
      {/* <GetPosts type="USER_POSTS">
          <div>
            <h2>No Posts!</h2>
            <p>Your write-ups will appear here!</p>
          </div>
        </GetPosts> */}
      {props.children}
    </>
  );
};

export default PostsListLayout;
