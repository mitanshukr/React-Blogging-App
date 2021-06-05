import axios from "../../../axios-instance";

const deletePostHandler = (e, idToken, postId, postsArr, isPrivate) => {
  e.stopPropagation();
  // e.target.parentNode.parentNode.pointerEvent = 'none';
  e.target.parentNode.parentNode.style.backgroundColor = "rgb(214, 213, 213)";
  Array.from(e.target.parentNode.parentNode.children).forEach((child) => {
    child.style.color = "rgb(184, 184, 184)";
    child.style.backgroundColor = "rgb(214, 213, 213)";
  });

  let URI;
  if (isPrivate) {
    URI = `/privatePosts/${postId}.json?auth=${idToken}`;
  } else {
    URI = `/publicPosts/${postId}.json?auth=${idToken}`;
  }

  return axios
    .delete(URI)
    .then((response) => {
      console.log(response);
      const posts = [...postsArr];
      const deletedPostIndex = posts.findIndex((post) => post.postId === postId);
      posts.splice(deletedPostIndex, 1);
      return Promise.resolve(posts);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export default deletePostHandler;
