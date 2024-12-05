import moment from 'moment';

// export const formatDateTime = (
//   date,
//   formatString = 'MMMM Do YYYY, h:mm:ss a',
// ) => {
//   return moment(date).format(formatString);
// };
// utils/dateTimeFormatter.js

export const formatDateTime = (date, formatString = 'MMM D YYYY, h:mm A') => {
  return moment(date).format(formatString);
};
