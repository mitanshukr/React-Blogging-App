// import axios from "../../../axios-instance";

// const getAllPosts = () => {
//   const postsArr = [];
//   return axios
//     .get("/publicPosts.json")
//     .then((response) => {
//       for (let postId in response.data) {
//         const postObj = {
//           ...response.data[postId],
//           postId: postId,
//         };
//         postsArr.push(postObj);
//       }
//       return Promise.resolve(postsArr);
//     })
//     .catch((err) => {
//       return Promise.reject(err);
//     });
// };

// const getPrivatePosts = (idToken, userId) => {
//   const postsArr = [];
//   const authParam = "?auth=" + idToken;
//   const queryParams = '&orderBy="user/userId"&equalTo="' + userId + '"';
//   return axios
//     .get("/privatePosts.json" + authParam + queryParams)
//     .then((response) => {
//       for (let postId in response.data) {
//         const postObj = {
//           ...response.data[postId],
//           postId: postId,
//         };
//         postsArr.push(postObj);
//       }
//       return Promise.resolve(postsArr);
//     })
//     .catch((err) => {
//       return Promise.reject(err);
//     });
// };

// const getPublicPosts = (userId) => {
//   const postsArr = [];
//   // const authParam = "?auth=" + idToken;
//   const queryParams = '?orderBy="user/userId"&equalTo="' + userId + '"';
//   return axios
//     .get("/publicPosts.json" + queryParams)
//     .then((response) => {
//       for (let postId in response.data) {
//         const postObj = {
//           ...response.data[postId],
//           postId: postId,
//         };
//         postsArr.push(postObj);
//       }
//       return Promise.resolve(postsArr);
//     })
//     .catch((err) => {
//       return Promise.reject(err);
//     });
// };

// const getPostsHandler = (requestType, idToken = null, userId = null) => {
//   if (requestType === "ALL") {
//     return getAllPosts();
//   } else if (requestType === "USER_PUBLIC") {
//     return getPublicPosts(userId);
//   } else if (requestType === "USER_PRIVATE") {
//     return getPrivatePosts(idToken, userId);
//   } else if (requestType === "USER_ALL") {
//     return Promise.all([
//       getPrivatePosts(idToken, userId),
//       getPublicPosts(userId),
//     ]);
//   }
// };

// export default getPostsHandler;
