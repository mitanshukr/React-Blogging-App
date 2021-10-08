const getBlogDateFormat = (date) => {
  let formattedDate =
    new Date(date).toLocaleString("en-US", { month: "short" }) +
    " " +
    new Date(date).getDate();
  formattedDate +=
    new Date(date).getFullYear() === new Date().getFullYear()
      ? ""
      : ", " + new Date(date).getFullYear();
  return formattedDate;
};

const getDateFormat = (date) => {
  if (!date) return;
  let _year = new Date(date).getFullYear();
  let _month = (new Date(date).getMonth() + 1).toString();
  let _date = new Date(date).getDate().toString();

  if (_month.length < 2) _month = "0" + _month;
  if (_date.length < 2) _date = "0" + _date;

  return [_year, _month, _date].join("-");
};

export { getBlogDateFormat, getDateFormat };
