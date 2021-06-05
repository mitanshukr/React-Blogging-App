const getSinglePostHandler = (e, props, postId, isPrivate) => {
    e.stopPropagation();
    if(isPrivate){
      props.history.push("/posts/private/" + postId);
  } else {
      props.history.push("/posts/" + postId);  
    }
}

export default getSinglePostHandler;