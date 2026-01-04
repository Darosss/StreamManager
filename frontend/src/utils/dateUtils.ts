import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const convertSecondsToMS = (secondsConvert: number) => {
  const duration = dayjs.duration(secondsConvert, "seconds");
  const minutes = Math.floor(duration.asMinutes());
  const seconds = (Math.floor(duration.asSeconds()) % 60)
    .toString()
    .padStart(2, "0");
  return [minutes, seconds];
};

export const getDateFromSecondsToYMDHMS = (time: number, separator = " ") => {
  const duration = dayjs.duration(time, "seconds");

  const seconds = Math.floor(duration.seconds());
  const minutes = Math.floor(duration.minutes());
  const hours = Math.floor(duration.hours());
  const days = Math.floor(duration.days());
  const months = duration.months();
  const years = duration.years();
  const timeArray = [
    years > 0 ? `${years.toFixed(0)}y${separator}` : "",
    months > 0 ? `${months.toFixed(0)}m${separator}` : "",
    days > 0 ? `${days.toFixed(0)}d${separator}` : "",
    hours > 0 ? `${hours}h${separator}` : "",
    minutes > 0 ? `${minutes}m${separator}` : "",
    seconds > 0 ? `${seconds}s` : "",
  ].filter(Boolean);
  return timeArray.join("");
};
export { dayjs };
