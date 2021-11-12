const getPostURI = (type, userId = null, userName = null, leftOffId = null) => {
  if (type === "FEED") {
    return `/post/feed/all?leftOffId=${leftOffId}`;
  } else if (type === "USER_POSTS") {
    return `/post/all/${userId}?private=true&leftOffId=${leftOffId}`;
  } else if (type === "PROFILE_POSTS") {
    return `/post/public/all/${userName}?leftOffId=${leftOffId}`;
  } else if (type === "LIKED_POSTS") {
    return `/post/likedpost/all/${userName}?leftOffId=${leftOffId}`;
  } else if (type === "SAVED_ITEMS") {
    return `/post/saveditems?leftOffId=${leftOffId}`;
  }
  return null;
};

export default getPostURI;
