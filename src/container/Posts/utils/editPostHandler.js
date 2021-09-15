const editPostHandler = (e, props, postId, isPrivate) => {
    e.stopPropagation();
    if(isPrivate){
      props.history.push("/post/private/edit/" + postId);
  } else {
      props.history.push("/post/edit/" + postId);
    }
}

export default editPostHandler;