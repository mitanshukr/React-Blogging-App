import axios from "axios";
import myAxios from '../axios-instance';

const localStorageHandler = (option, idToken = null, localId = null, expiryTime = 0) => {
    if(option === 'SET_ITEM'){
        localStorage.setItem('token', idToken);
        localStorage.setItem('userId', localId);
        localStorage.setItem('expiryTime', expiryTime);
    } else if(option === 'REMOVE_ITEM'){
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiryTime');
    } else if(option === 'GET_ITEM'){
        return {
            idToken: localStorage.getItem('token'),
            localId: localStorage.getItem('userId'),
            expiryTime: localStorage.getItem('expiryTime'),
        }
    }
}

let timeout;
const sessionTimeout = (timeoutInMilliSec) => {
  return (dispatch) => {
    timeout = setTimeout(() => {
    //   dispatch(logoutActionHandler());
    }, timeoutInMilliSec);
  };
};

const errorHandler = error => {
    return dispatch => {
        dispatch({type: 'error', error: error});
    }
}

const sessionRefresher = () => {
    return dispatch => {
        console.log("session Refresher....inside If!");
        dispatch({type: 'serverStatus', serverBusy: true});
    let localStorageData = localStorageHandler("GET_ITEM");
    const timeLeft = localStorageData.expiryTime - Date.now();
    if(localStorageData.idToken && timeLeft > 0){
        const URI = `/users.json?auth=${localStorageData.idToken}&orderBy="userId"&equalTo="${localStorageData.localId}"`;
        myAxios.get(URI)
        .then(response => {
            const userKey = Object.keys(response.data)[0];
            localStorageData = {
              ...localStorageData,
                firstName: response.data[userKey].firstName,
                lastName: response.data[userKey].lastName,
                userName: response.data[userKey].userName,
                email:  response.data[userKey].email,
            };
            clearTimeout(timeout);
            dispatch(sessionTimeout(timeLeft));
            dispatch({type: 'loginSuccess', userData: localStorageData});
            dispatch({type: 'serverStatus', serverBusy: false});
        }).catch(err => {
            console.log(err);
            dispatch({type: 'serverStatus', serverBusy: false});
            dispatch(errorHandler(err.response?.data.error || err));
        });
        
    } else {
        dispatch(logoutActionHandler());
        dispatch({type: 'serverStatus', serverBusy: false});
    }
}
}
 
const loginActionHandler = (email, password) => {
    console.log("Login...called!");
    let loginResponse = null;
    const userCred = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    return (dispatch) => {
        dispatch({type: 'serverStatus', serverBusy: true});
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API}`, userCred)
        .then(response => {
            loginResponse = {...response};
            const URI = `/users.json?auth=${response?.data.idToken}&orderBy="userId"&equalTo="${response?.data.localId}"`;
            return myAxios.get(URI);
        }).then(response => {
            const userKey = Object.keys(response.data)[0];
            loginResponse = {
              ...loginResponse,
              data: {
                ...loginResponse.data,
                firstName: response.data[userKey].firstName,
                lastName: response.data[userKey].lastName,
                userName: response.data[userKey].userName,
              },
            };
            console.log(loginResponse);
            localStorageHandler('SET_ITEM', loginResponse?.data.idToken, loginResponse?.data.localId, (Date.now() + 3600*1000));    //loginResponse.data.expiresIn = 3600;
            dispatch(sessionTimeout(loginResponse?.data.expiresIn * 1000 + Date.now()));
            dispatch({type: 'loginSuccess', userData: loginResponse?.data});
            dispatch({type: 'serverStatus', serverBusy: false});
        }).catch(err => {
            // console.log(err.response?.data.error);
            dispatch({type: 'serverStatus', serverBusy: false});
            dispatch(errorHandler(err.response?.data.error || err));
        });
    }
}

function capitalize(s){
    return s[0].toUpperCase() + s.slice(1);
}

const signupActionHandler = (email, password, firstName, lastName) => {
    const userCred = {
        email: email,
        password: password,
        returnSecureToken: true
    }

    const userData = {
        userId: null,
        email: email,
        userName: email.split('@')[0],
        firstName: capitalize(firstName),
        lastName: capitalize(lastName),
        isEmailVerified: false,
    }

    return (dispatch) => {
        dispatch({type: 'serverStatus', serverBusy: true});
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCUnhR5E92IJUKpmuj-cP5gKBeXGerxkRA', userCred)
        .then(response => {
            userData.userId = response.data.localId;
            return myAxios.post('/users.json', userData);
        }).then(() => {
            dispatch({type: 'signupSuccess'});
            dispatch({type: 'serverStatus', serverBusy: false});
        }).catch(err => {
            dispatch(errorHandler(err.response?.data.error || err));
            dispatch({type: 'serverStatus', serverBusy: false});
        });
    }
}

const logoutActionHandler = () => {
    console.log("Logout Handler called...!");
    return dispatch => {
        localStorageHandler('REMOVE_ITEM');
        clearTimeout(timeout);
        dispatch({type: 'logoutSuccess'});
    }
}

const dispatchBodyHandler = body => {
    return {
        type: 'dispatchBody',
        body: body
    }
}

const userIconStatusHandler = status => {
    return { type: "userIcon", status: status }
}

export {userIconStatusHandler, errorHandler, sessionRefresher, loginActionHandler, signupActionHandler, logoutActionHandler, dispatchBodyHandler };