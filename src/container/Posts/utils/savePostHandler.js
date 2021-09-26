import axios from "../../../axios-instance";

const savePostHandler = (authToken, postId) => {
  return axios
    .get(`http://localhost:8000/post/togglesave/${postId}`, {
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

export default savePostHandler;
