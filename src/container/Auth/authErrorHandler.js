const getErrorMsg = (err) => {
  if (err.message.toLowerCase().includes("network error")) {
    return "Network Error! Please check your connectivity.";
  } else if (err.response?.data?.status === 500) {
    return "Server Error! Please try again Later.";
  } else if (err.response?.data?.message) {
    return err.response?.data?.message;
  } else {
    return "Something Went Wrong! Please try again.";
  }
};

export default getErrorMsg;
