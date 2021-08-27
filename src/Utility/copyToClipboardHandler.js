const postShareHandler = (e, postId) => {
  e.stopPropagation();
  const link = window.location.origin + "/post/" + postId;
  if (!navigator.clipboard) {
    alert(`Clipboard API not available.\n${link}`);
    return;
  }
  navigator.clipboard
    .writeText(link)
    .then(() => {
      console.log("Copied to Clipboard.");
    })
    .catch((err) => {
      alert("Failed to Copy, Please Try again! Error: ", err);
    });
};

export default postShareHandler;
