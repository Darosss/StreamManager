import dayjs from "src/utils/utils";

interface DateTooltipCommonProps {
  date: Date | number;
}

interface DateTooltipProps extends DateTooltipCommonProps {
  suffix?: boolean;
}

interface DateDifferenceProps {
  dateStart: Date;
  dateEnd: Date;
  format?: dayjs.QUnitType | dayjs.OpUnitType;
  precise?: boolean;
}

export function DateTooltip({ date, suffix }: DateTooltipProps) {
  return (
    <div className="tooltip">
      <span className="tooltip-default">{dayjs(date).fromNow(!suffix)}</span>
      <span className="tooltip-text">
        {dayjs(date).format("dddd, MMMM Do YYYY, HH:mm:ss")}
      </span>
    </div>
  );
}

export function DateTimeTooltip({ date }: DateTooltipCommonProps) {
  return (
    <div className="tooltip">
      <span className="tooltip-default">{dayjs(date).format("HH:mm:ss")}</span>
      <span className="tooltip-text">
        {dayjs(date).format("MM D YYYY, HH:mm:ss")}
      </span>
    </div>
  );
}

export function DateDifference({
  dateStart,
  dateEnd,
  format = "m",
  precise = true,
}: DateDifferenceProps) {
  return (
    <div className="tooltip">
      <span className="tooltip-default">
        {dayjs(dateEnd).diff(dateStart, format, precise).toFixed(1)} {format}
      </span>
      <span className="tooltip-text">
        {dayjs(dateStart).format("ddd, HH:mm:ss")} <br />
        {dayjs(dateEnd).format("ddd, HH:mm:ss")}
      </span>
    </div>
  );
}
