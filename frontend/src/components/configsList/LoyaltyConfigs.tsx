import { useAppDispatch, useAppSelector } from "@redux";
import ConfigInput from "./ConfigInput";

import { setLoyaltyConfigs } from "@redux/configsSlice";

export default function LoyaltyConfigsWrapper() {
  const dispatch = useAppDispatch();
  const {
    isUpdateMode,
    config: { loyaltyConfigs },
  } = useAppSelector((state) => state.configs);

  return (
    <>
      <ConfigInput
        optionName="Interval check chatters delay"
        setState={(e) =>
          dispatch(
            setLoyaltyConfigs([
              "intervalCheckChatters",
              e.currentTarget.valueAsNumber,
            ]),
          )
        }
        value={loyaltyConfigs.intervalCheckChatters}
        showEdit={isUpdateMode}
      />
    </>
  );
}
