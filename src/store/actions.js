import axios from "axios";
// import axios from "../axios-instance";

const localStorageHandler = (
  option,
  authToken = null,
  userId = null,
  expiryTime = 0
) => {
  if (option === "SET_ITEM") {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiryTime", expiryTime);
  } else if (option === "REMOVE_ITEM") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryTime");
  } else if (option === "GET_ITEM") {
    return {
      authToken: localStorage.getItem("authToken"),
      userId: localStorage.getItem("userId"),
      expiryTime: localStorage.getItem("expiryTime"),
    };
  }
};

const logoutActionHandler = () => {
  console.log("Logout Handler called...!");
  return (dispatch) => {
    localStorageHandler("REMOVE_ITEM");
    clearTimeout(timeout);
    dispatch({ type: "logoutSuccess" });
  };
};

let timeout;
const sessionTimeout = (timeoutInMilliSec) => {
  return (dispatch) => {
    console.log("logoutSet...");
    timeout = setTimeout(() => {
      console.log("logout called...");
      dispatch(logoutActionHandler());
    }, timeoutInMilliSec);
  };
};

const errorHandler = (error) => {
  return (dispatch) => {
    dispatch({ type: "error", error: error });
  };
};

const sessionRefresher = () => {
  return (dispatch) => {
    dispatch({ type: "serverStatus", serverBusy: true });
    let localStorageData = localStorageHandler("GET_ITEM");
    const timeLeft = localStorageData.expiryTime - Date.now();
    if (localStorageData.authToken && timeLeft > 0) {
      const URI = `http://localhost:8000/user/${localStorageData.userId}`;
      axios
        .get(URI, {
          headers: {
            Authorization: `Bearer ${localStorageData.authToken}`,
          },
        })
        .then((response) => {
          clearTimeout(timeout);
          dispatch(sessionTimeout(timeLeft));
          response.data.authToken = localStorageData.authToken;
          console.log(response.data);
          dispatch({ type: "loginSuccess", userData: response.data });
          dispatch({ type: "serverStatus", serverBusy: false });
        })
        .catch((err) => {
          console.log(err);
          dispatch({ type: "serverStatus", serverBusy: false });
          dispatch(errorHandler(err.message || err));
        });
    } else {
      dispatch(logoutActionHandler());
      dispatch({ type: "serverStatus", serverBusy: false });
    }
  };
};

const loginActionHandler = (userData) => {
  return (dispatch) => {
    localStorageHandler(
      "SET_ITEM",
      userData.authToken,
      userData.userId,
      Date.now() + userData.expiresIn * 1000
    );
    dispatch(sessionTimeout(userData.expiresIn * 1000));
    dispatch({ type: "loginSuccess", userData: userData });
  };
};

const dispatchBodyHandler = (body) => {
  return {
    type: "dispatchBody",
    body: body,
  };
};

const hideNotification = (message, type) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({
        type: "handleNotification",
        message: message,
        visibility: false,
        status: type,
      });
    }, 2000);
  };
};

const showNotification = (message, type) => {
  return (dispatch) => {
    dispatch({
      type: "handleNotification",
      message: message,
      visibility: true,
      status: type,
    });
    dispatch(hideNotification(message, type));
  };
};

export {
  errorHandler,
  sessionRefresher,
  loginActionHandler,
  logoutActionHandler,
  dispatchBodyHandler,
  showNotification,
};
