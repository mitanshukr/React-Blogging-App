const getErrorMsg = (err) => {
  if (err.message.toLowerCase().includes("network error")) {
    return "Server Down! Please try again later.";
  } else if (err.response?.data?.message) {
    return err.response?.data?.message;
  } else {
    return "Something Went Wrong! Please try again.";
  }
};

export default getErrorMsg;
