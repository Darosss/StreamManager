import { useEffect, useRef, useState } from "react";

type ButtonSize = "small" | "medium" | "large";
type SelectVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "success";

type OptionType = { label: string; value: string };

interface SelectProps {
  options?: OptionType[];
  variant?: SelectVariant;
  placeholder: string;
  defaultValue?: OptionType;
  disabled?: boolean;
  isSearchable?: boolean;
  size?: ButtonSize;
  className?: string | { overrideAll?: true; value: string };
  onSelect: (option: OptionType) => void;
  onChangeSearch?: (value: string) => void;
}
export default function Select({
  options,
  onSelect,
  onChangeSearch,
  defaultValue,
  isSearchable,
  placeholder,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<OptionType | null>(
    defaultValue || null
  );
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredOptions = options?.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );
  const handleSelect = (option: OptionType) => {
    onSelect(option);
    setSelectedValue(option);
    setIsOpen(false);
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleQuery = (value: string) => {
    onChangeSearch?.(value);
    setQuery(value);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div ref={dropdownRef} className="select-wrapper">
      <div onClick={() => setIsOpen(!isOpen)} className="select-value">
        {selectedValue ? selectedValue.label : placeholder}
      </div>
      {isOpen && (
        <div className="select-options">
          {isSearchable && (
            <input
              type="text"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              placeholder="Search..."
            />
          )}
          {filteredOptions?.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`select-one-option ${
                !option.label ? "option-clear" : ""
              }`}
            >
              {option.label || "❌"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
