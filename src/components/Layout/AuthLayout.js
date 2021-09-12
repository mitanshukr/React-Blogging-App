import classes from './AuthLayout.module.css';

const AuthLayout = (props) => {
  return <div className={classes.AuthLayout}>{props.children}</div>;
};

export default AuthLayout;
