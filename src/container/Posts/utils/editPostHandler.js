const editPostHandler = (e, props, postId, isPrivate) => {
  e.stopPropagation();
  if (isPrivate) {
    props.history.push({
      pathname: `/post/private/edit/${postId}`,
      state: { prevPath: props.location.pathname },
    });
  } else {
    props.history.push({
      pathname: `/post/edit/${postId}`,
      // search: '',
      state: { prevPath: props.location.pathname },
    });
    // props.history.push("/post/edit/" + postId);
  }
};

export default editPostHandler;
