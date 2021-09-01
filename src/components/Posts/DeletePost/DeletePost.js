import classes from "./DeletePost.module.css";

const DeletePost = (props) => {
  return (
    <div className={classes.DeletePost}>
      <p>
        Are you sure want to delete?
        <br />
        <small>This will be permanent.</small>
      </p>
      <section className={classes.DeletePost__actions}>
        <span onClick={props.onCancel}>Cancel</span>
        <span
          onClick={props.onDelete}
          className={props.deleteCount ? classes.deleteBtnActive : ""}
        >
          {props.deleteCount ? `Deleting in ${props.deleteCount}s` : "Delete"}
        </span>
      </section>
    </div>
  );
};

export default DeletePost;
