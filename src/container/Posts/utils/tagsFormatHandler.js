const getStringToTagsArray = (tagString) => {
  if (tagString.length === 0) return [];
  return tagString
    .replace(/\s+/g, " ") //removes extra(more than 1) whitespaces
    .split(",")
    .map((tag) => {
      const _tag = tag.trim().toLowerCase();
      if (_tag[0] === "#") return _tag.slice(1);
      return _tag;
    });
};

const getTagArrayToString = (tagArr) => {
  if (tagArr.length === 0) return "";
  return tagArr.join(", ");
};

export { getStringToTagsArray, getTagArrayToString };
