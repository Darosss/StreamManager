import { Button } from "@components/ui/button";

interface TabsButtonsProps<
  TabValueType,
  TabsType extends Record<string, TabValueType>,
> {
  possibleTabs: TabsType;
  activeTab: TabValueType;
  setActiveTab: (tab: TabValueType) => void;
}
export default function TabsButtons<
  TabValueType extends string | number,
  TabsType extends Record<string, TabValueType>,
>({
  possibleTabs,
  activeTab,
  setActiveTab,
}: TabsButtonsProps<TabValueType, TabsType>) {
  return (
    <>
      {Object.values(possibleTabs).map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "primary" : "tertiary"}
          className="switch-players-button"
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Button>
      ))}
    </>
  );
}
