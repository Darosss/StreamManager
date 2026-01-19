import { InputHTMLAttributes } from "react";

interface FilterBarInputProps extends InputHTMLAttributes<HTMLInputElement> {
  queryparam: string;
}

export default function FilterBarInput({
  queryparam,
  ...rest
}: FilterBarInputProps) {
  return <input {...{ queryparam: queryparam }} {...rest} />;
}
