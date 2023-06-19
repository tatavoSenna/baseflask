const firstDayPreviousMonth = () => {
  var date = new Date();
  var month = date.getMonth();
  var year = month === 0 ? date.getFullYear() - 1 : date.getFullYear();
  return new Date(year, month === 0 ? 11 : month - 1, 1);
};

export const midnightPreviousToCurrentMonth = () => {
  var date = new Date(); // current date
  date.setDate(1); // going to 1st of the month
  date.setHours(0);
  //date.setHours(-1); // going to last hour before this date even started.
  return date;
};

export const firstDayNextGivenMonth = (date) => {
  var newDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
  newDate.setMonth(date.getMonth()+1);
  newDate.setDate(1);
  //newDate.setHours(0);
  return newDate;
};

export const lastDayPreviousGivenMonth = (date) => {
  const newDate = new Date(date.getFullYear(), date.getMonth(), 0);
  return newDate;
};

export const lastDayGivenMonth = (date) => {
  const newDate = new Date(date.getFullYear(), date.getMonth() +1, 0);
  return newDate;
};

export const startHour = () => {
  return new Date(2022, 1, 1, 0, 0, 0);
};

export const endHour = () => {
  return new Date(2022, 1, 1, 23, 0, 0);
};

export const hourString = (date) => {
  return (
    date.getHours().toString().padStart(2, 0) +
    ":" +
    date.getMinutes().toString().padStart(2, 0) +
    ":00"
  );
};

export const dateString = (date) => {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0)
  );
};

export default firstDayPreviousMonth;
