const getPostURI = (type, userId = null, userName = null) => {
  if (type === "FEED") {
    return "http://localhost:8000/post/feed/all";
  } else if (type === "USER_POSTS") {
    return `http://localhost:8000/post/all/${userId}?private=true`;
  } else if (type === "PROFILE_POSTS") {
    return `http://localhost:8000/post/public/all/${userName}`;
  } else if (type === "LIKED_POSTS") {
    return `http://localhost:8000/post/likedpost/all/${userName}`;
  } else if (type === "SAVED_ITEMS") {
    return "http://localhost:8000/post/saveditems";
  }
  return null;
};

export default getPostURI;
