import classes from "./Tag.module.css";

const Tag = (props) => {
  return (
    <span className={classes.Tag} title={`tag:${props.children}`}>
      #{props.children}
    </span>
  );
};

export default Tag;
