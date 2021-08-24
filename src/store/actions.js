import axios from "axios";
import myAxios from "../axios-instance";

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

let timeout;
const sessionTimeout = (timeoutInMilliSec) => {
  return (dispatch) => {
    timeout = setTimeout(() => {
      //   dispatch(logoutActionHandler());
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
    console.log("session Refresher....inside If!");
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
  console.log("Login...called!");
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
          response.data.token,
          response.data.userId,
          Date.now() + 3600 * 1000
        );
        dispatch(sessionTimeout(Date.now() + 3600 * 1000));
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
  return s[0].toUpperCase() + s.slice(1);
}

const signupActionHandler = (email, password, firstName, lastName) => {
  const userCred = {
    email: email,
    password: password,
    returnSecureToken: true,
  };

  const userData = {
    userId: null,
    email: email,
    userName: email.split("@")[0],
    firstName: capitalize(firstName),
    lastName: capitalize(lastName),
    isEmailVerified: false,
  };

  return (dispatch) => {
    dispatch({ type: "serverStatus", serverBusy: true });
    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCUnhR5E92IJUKpmuj-cP5gKBeXGerxkRA",
        userCred
      )
      .then((response) => {
        userData.userId = response.data.userId;
        return myAxios.post("/users.json", userData);
      })
      .then(() => {
        dispatch({ type: "signupSuccess" });
        dispatch({ type: "serverStatus", serverBusy: false });
      })
      .catch((err) => {
        dispatch(errorHandler(err.response?.data.error || err));
        dispatch({ type: "serverStatus", serverBusy: false });
      });
  };
};

const logoutActionHandler = () => {
  console.log("Logout Handler called...!");
  return (dispatch) => {
    localStorageHandler("REMOVE_ITEM");
    clearTimeout(timeout);
    dispatch({ type: "logoutSuccess" });
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

export {
  userIconStatusHandler,
  errorHandler,
  sessionRefresher,
  loginActionHandler,
  signupActionHandler,
  logoutActionHandler,
  dispatchBodyHandler,
};
