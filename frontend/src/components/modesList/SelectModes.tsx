import { Tag, Affix, Mood } from "@services";

interface SelectModesProps {
  value: string;
  onChange: (value: string) => void;
  data?: Tag[] | Affix[] | Mood[];
  withEmpty?: boolean;
}

export default function SelectModes({
  value,
  onChange,
  data,
  withEmpty = true,
}: SelectModesProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {withEmpty && <option value=""></option>}
      {data?.map((item, index) => {
        return (
          <option
            style={{ backgroundColor: `${item.enabled ? "green" : "red"}` }}
            key={index}
            value={item._id}
          >
            {item.name}
          </option>
        );
      })}
    </select>
  );
}
