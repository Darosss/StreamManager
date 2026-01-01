import { Button } from "@components/ui";

interface ConfigButtonProps {
  optionName: string;
  setState: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  value: Boolean;
  showEdit: boolean;
}

export default function ConfigButton({
  optionName,
  setState,
  value,
  showEdit = false,
}: ConfigButtonProps) {
  const button = () => {
    return (
      <Button
        variant={value ? "primary" : "danger"}
        onClick={(e) => setState(e)}
      >
        {String(value)}
      </Button>
    );
  };

  return (
    <>
      <div> {optionName} </div>
      <div>{showEdit ? button() : String(value)}</div>
    </>
  );
}
