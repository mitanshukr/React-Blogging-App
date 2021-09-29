import axios from "../../../axios-instance";

const deletePostHandler = (authToken, postId) => {
  return axios
    .delete(`http://localhost:8000/post/delete/${postId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export default deletePostHandler;
