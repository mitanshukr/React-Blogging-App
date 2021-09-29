const getErrorStatusCode = (err) => {
  if (err.response?.status) {
    return +err.response?.status;
  } else if (err.message?.toLowerCase().includes("network error")) {
    return -1;
  } else {
    return -2; //default case: SOMETHING_WENT_WRONG
  }
};

export default getErrorStatusCode;
