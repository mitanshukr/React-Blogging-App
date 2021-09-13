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

const loginActionHandler = (email, password) => {
  const userCred = {
    email: email,
    password: password,
  };
  return (dispatch) => {
    dispatch({ type: "serverStatus", serverBusy: true });
    return axios
      .post(`http://localhost:8000/auth/login`, userCred)
      .then((response) => {
        localStorageHandler(
          "SET_ITEM",
          response.data.authToken,
          response.data.userId,
          Date.now() + response.data.expiresIn * 1000
        );
        dispatch(sessionTimeout(response.data.expiresIn * 1000));
        dispatch({ type: "loginSuccess", userData: response.data });
        dispatch({ type: "serverStatus", serverBusy: false });
      })
      .catch((err) => {
        console.log(err.message);
        dispatch({ type: "serverStatus", serverBusy: false });
        dispatch(errorHandler(err.message || err));
      });
  };
};

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

const signupActionHandler = (email, password, firstName, lastName) => {
  const userData = {
    email: email,
    password: password,
    firstName: capitalize(firstName),
    lastName: capitalize(lastName),
  };

  return (dispatch) => {
    dispatch({ type: "serverStatus", serverBusy: true });
    axios
      .post("http://localhost:8000/auth/signup", userData)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: "signupSuccess" });
        dispatch({ type: "serverStatus", serverBusy: false });
      })
      .catch((error) => {
        console.log(error.response);
        dispatch(errorHandler(error.message || error));
        dispatch({ type: "serverStatus", serverBusy: false });
      });
  };
};

const dispatchBodyHandler = (body) => {
  return {
    type: "dispatchBody",
    body: body,
  };
};

const userIconStatusHandler = (status) => {
  return { type: "userIcon", status: status };
};

const showNotification = (message, visibility) => {
  return {
    type: "handleNotification",
    message: message,
    visibility: visibility,
  };
};

const postSaveToggler = (status, postId, authToken, savedItemsArray = []) => {
  return (dispatch) => {
    dispatch({
      type: "updateSavedItems",
      status: status,
      postId: postId,
      savedItemsArray: savedItemsArray,
    });
    if (status !== "UPDATE") {
      axios
        .get(`http://localhost:8000/post/togglesave/${postId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          dispatch(showNotification(response.data.message, true));
          setTimeout(() => {
            dispatch(showNotification(response.data.message, false));
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};

export {
  userIconStatusHandler,
  errorHandler,
  sessionRefresher,
  loginActionHandler,
  signupActionHandler,
  logoutActionHandler,
  dispatchBodyHandler,
  showNotification,
  postSaveToggler,
};
