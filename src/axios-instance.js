import axios from "axios";

const instance = axios.create({
  baseURL: "https://immune-ink-server.onrender.com/",
});

export default instance;
