const dateFormatter = (date) => {
    let formattedDate = new Date(date).toLocaleString('en-US', {month: 'short'}) + " " + new Date(date).getDate();
    formattedDate += new Date(date).getFullYear() === new Date().getFullYear() ? "" : ", " + new Date(date).getFullYear();
    return formattedDate;
}

export default dateFormatter;