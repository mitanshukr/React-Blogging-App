const initialState = {
    body: null,
    authToken: null,
    userId: null,
    email: null,
    userName: null,
    firstName: null,
    lastName: null,
    // about: null,
    expiryTime: null,
    isAuthenticated: false,
    error: null,
    serverBusy: false,
    backgroundImage: null,
    isUserIconSelected: false,
}

const reducer = (state = initialState, action) => {
    if(action.type === 'loginSuccess'){
        return {
            ...state,
            authToken: action.userData.token,
            userId: action.userData.userId,
            expiryTime: (Date.now() + 3600 * 1000),
            firstName: action.userData.firstName,
            lastName: action.userData.lastName,
            userName: action.userData.userName,
            email: action.userData.email,
            isAuthenticated: true,
            isSignupSuccess: null,
            error: null
        }
    } else if(action.type === 'signupSuccess'){
        return {
            ...state,
            error: "Signup Successful! Please Login to Continue..."
        }
    } else if(action.type === 'logoutSuccess'){
        return {
            ...state,
            authToken: null,
            userId: null,
            expiryTime: null,
            isAuthenticated: false,
            error: null,
            firstName: null,
            lastName: null,
            userName: null,
        }
    } else if(action.type === 'error'){
        if(action.error?.message === "INVALID_PASSWORD"){
            action.error.message = "Invalid Email or Password.\nPlease Try again!";
        } else if(action.error?.message === "EMAIL_NOT_FOUND") {
            action.error.message = "No Account exists with this Email.\nPlease Signup to get access!";
        } else if(action.error?.message === "EMAIL_EXISTS") {
            action.error.message = "Email already Registered! Try Logging in, or signup with different email.";
        }
        return {
            ...state,
            error: action.error?.message
        }
    } else if(action.type === 'serverStatus'){
        return {
            ...state,
            serverBusy: action.serverBusy
        }
    } else if (action.type === 'dispatchBody'){
        return {
            ...state,
            body: action.body
        }
    } else if(action.type === 'userIcon'){
        return {
            ...state,
            isUserIconSelected: action.status
        }
    }
    return state;
}

export default reducer;