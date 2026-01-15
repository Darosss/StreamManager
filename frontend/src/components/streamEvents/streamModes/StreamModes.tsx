import { Loading } from "@components/axiosHelper";
import { Button } from "@components/ui/button";
import { NOTIFICATION_TYPE, useNotifications } from "@contexts";
import { useGetAllModes } from "@hooks";
import { useEditTag, useEditMood, useEditAffix } from "@services";

export default function StreamModes() {
  const { addNotify } = useNotifications();
  const editTagMutation = useEditTag();

  const editMoodMutation = useEditMood();

  const editAffixMutation = useEditAffix();

  const modes = useGetAllModes();

  if (!modes) return <Loading />;
  const { tags, affixes, moods } = modes;

  return (
    <>
      <div className="stream-modes-wrapper">
        <div className="widget-header"> Stream modes </div>
        <div className="stream-modes-section-wrapper">
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              <Button variant="secondary">Tags </Button>
            </div>
            {tags?.map((tag, index) => {
              return (
                <div key={index}>
                  <Button
                    variant={tag.enabled ? "primary" : "danger"}
                    onClick={() => {
                      editTagMutation.mutate({
                        id: tag._id,
                        updatedTag: { enabled: !tag.enabled },
                      });
                    }}
                  >
                    {tag.name}
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              {/* TODO: REFACTOR UNDER */}
              <Button
                variant="secondary"
                onClick={(e) => {
                  let prefixes: string[] = [];
                  let suffixes: string[] = [];

                  affixes.forEach((affix) => {
                    if (!affix.enabled) return;
                    prefixes.push(affix.prefixes.join(" | "));
                    suffixes.push(affix.suffixes.join(" | "));
                  });
                  addNotify({
                    title: "Enabled prefixes",
                    message: `${prefixes.join(" | ")}`,
                    type: NOTIFICATION_TYPE.INFO,
                    duration: 25000,
                  });
                  addNotify({
                    title: "Enabled suffixes",
                    message: `${suffixes.join(" | ")}`,
                    type: NOTIFICATION_TYPE.INFO,
                    duration: 25000,
                  });
                }}
              >
                Affixes
              </Button>
            </div>

            {affixes?.map((affix, index) => {
              return (
                <div key={index}>
                  <Button
                    variant={affix.enabled ? "primary" : "danger"}
                    onClick={() => {
                      editAffixMutation.mutate({
                        id: affix._id,
                        updatedAffix: { enabled: !affix.enabled },
                      });
                    }}
                  >
                    {affix.name}
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="stream-modes-section">
            <div className="stream-modes-section-name">
              <Button variant="secondary">Moods</Button>
            </div>

            {moods?.map((mood, index) => {
              return (
                <div key={index}>
                  <Button
                    variant={mood.enabled ? "primary" : "danger"}
                    onClick={() => {
                      editMoodMutation.mutate({
                        id: mood._id,
                        updatedMood: { enabled: !mood.enabled },
                      });
                    }}
                  >
                    {mood.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
