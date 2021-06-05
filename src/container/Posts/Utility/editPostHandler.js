const editPostHandler = (e, props, postId, isPrivate) => {
    e.stopPropagation();
    if(isPrivate){
      props.history.push("/posts/private/edit/" + postId);
  } else {
      props.history.push("/posts/edit/" + postId);
    }
}

export default editPostHandler;