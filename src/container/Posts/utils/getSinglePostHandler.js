const getSinglePostHandler = (e, props, postId, isPrivate) => {
  e.stopPropagation();
  if (isPrivate) {
    // props.history.push({
    //   pathname: `/post/${postId}`,
    //   state: { isPrivate: true },
    // });
    props.history.push(`/post/private/${postId}`);
  } else {
    // props.history.push({
    //   pathname: `/post/${postId}`,
    //   state: { isPrivate: false },
    // });
    props.history.push(`/post/${postId}`);
  }
};

export default getSinglePostHandler;
