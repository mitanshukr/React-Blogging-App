const editPostHandler = (e, props, postId, isPrivate) => {
  e.stopPropagation();
  if (isPrivate) {
    if (props.location.pathname.includes("/post/")) {
      props.history.replace(`/post/private/edit/${postId}`);
    } else {
      props.history.push(`/post/private/edit/${postId}`);
    }
  } else {
    if (props.location.pathname.includes("/post/")) {
      props.history.replace(`/post/edit/${postId}`);
    } else {
      props.history.push(`/post/edit/${postId}`);
    }
    // props.history.replace({
    //   pathname: `/post/edit/${postId}`,
    //   search: '',
    //   state: { prevPath: props.location.pathname },
    // });
  }
};

export default editPostHandler;
