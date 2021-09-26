const getPostURI = (type, userId = null, userName = null, leftOffId = null) => {
  if (type === "FEED") {
    return `http://localhost:8000/post/feed/all?leftOffId=${leftOffId}`;
  } else if (type === "USER_POSTS") {
    return `http://localhost:8000/post/all/${userId}?private=true&leftOffId=${leftOffId}`;
  } else if (type === "PROFILE_POSTS") {
    return `http://localhost:8000/post/public/all/${userName}?leftOffId=${leftOffId}`;
  } else if (type === "LIKED_POSTS") {
    return `http://localhost:8000/post/likedpost/all/${userName}?leftOffId=${leftOffId}`;
  } else if (type === "SAVED_ITEMS") {
    return `http://localhost:8000/post/saveditems?leftOffId=${leftOffId}`;
  }
  return null;
};

export default getPostURI;
