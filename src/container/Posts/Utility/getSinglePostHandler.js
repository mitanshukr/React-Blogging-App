const getSinglePostHandler = (e, props, postId, isPrivate) => {
    e.stopPropagation();
    if(isPrivate){
      props.history.push("/post/private/" + postId);
  } else {
      props.history.push("/post/" + postId);  
    }
}

export default getSinglePostHandler;