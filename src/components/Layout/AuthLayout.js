import classes from "./AuthLayout.module.css";

const AuthLayout = (props) => {
  return (
    <div style={props.style} className={classes.AuthLayout}>
      {props.children}
    </div>
  );
};

export default AuthLayout;
