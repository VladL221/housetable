import moment from 'moment';

const getDaysOfMonth = () => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const formatedFirstDay = moment(firstDayOfMonth).format('YYYY-MM-DD');
  const formatedLastDay = moment(lastDayOfMonth).format('YYYY-MM-DD');
  return [formatedFirstDay, formatedLastDay];
};

const getDaysOfWeek = () => {
  const currentDate = new Date();
  const allDaysFollowingSunday = 6;
  const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
  const lastDayOfWeek = firstDayOfWeek + allDaysFollowingSunday;
  const firstDay = new Date(currentDate.setDate(firstDayOfWeek)).toISOString();
  const lastDay = new Date(currentDate.setDate(lastDayOfWeek)).toISOString();
  const formatedFirstDay = moment(firstDay).format('YYYY-MM-DD');
  const formatedLastDay = moment(lastDay).format('YYYY-MM-DD');
  return [formatedFirstDay, formatedLastDay];
};

export default {
  getDaysOfWeek,
  getDaysOfMonth,
};
