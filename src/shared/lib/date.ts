import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// eslint-disable-next-line import-x/no-named-as-default-member
dayjs.extend(utc);

export type DateValue = string | number | Date;
export type DateUnit = "day" | "hour" | "minute" | "month" | "second" | "week" | "year";
export const DEFAULT_DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const parseDate = (value: DateValue): Date => dayjs(value).toDate();
export const formatDate = (value: DateValue, format = DEFAULT_DATE_TIME_FORMAT): string =>
  dayjs(value).format(format);

export const getYear = (value: DateValue): number => dayjs(value).year();
