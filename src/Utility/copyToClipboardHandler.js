const postShareHandler = (e, postId) => {
  e.stopPropagation();
  const link = window.location.origin + "/post/" + postId;
  if (!navigator.clipboard) {
    alert(`Clipboard API not available.\n${link}`);
    return;
  }
  return navigator.clipboard
    .writeText(link)
    .then(() => {
      console.log("Copied to Clipboard.");
      return Promise.resolve("Copied to Clipboard.");
    })
    .catch((err) => {
      console.log("Failed to Copy, Please Try again! Error: ", err);
      return Promise.reject("Failed to Copy, Try Again!");
    });
};

export default postShareHandler;
