import axios from "axios";

const instance = axios.create({
    baseURL: 'https://note-app---react-proj-default-rtdb.firebaseio.com/',
});

export default instance;