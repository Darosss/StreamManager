import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { setIsGoalTime } from "@redux/stagesSlice";
import { Button } from "@components/ui/button";
interface AchievementStageTheadDataProps {
  editing: boolean;
}
export default function AchievementStageTheadData({
  editing,
}: AchievementStageTheadDataProps) {
  return (
    <tr className="stages-list-data-thead">
      <th>Nr. </th>
      <th>
        <div>
          <div>Name</div>
          <div>Stage</div>
          <div> Rarity (1-10)</div>
        </div>
      </th>
      <th>Goal {editing ? <ToggleGoalIsTimeBtn /> : null}</th>
      <th>Show Time (sec)</th>
      <th>
        <Button>
          <Link to="../../badges">Badge</Link>
        </Button>
      </th>
      <th>
        <Button>
          <Link to="../sounds" className="common-button primary-button">
            Sounds
          </Link>
        </Button>
      </th>
    </tr>
  );
}

function ToggleGoalIsTimeBtn() {
  const { isGoalTime } = useSelector((root: RootStore) => root.stages);
  const dispatch = useDispatch();
  return (
    <Button
      variant={isGoalTime ? "primary" : "danger"}
      onClick={() => dispatch(setIsGoalTime(!isGoalTime))}
    >
      {isGoalTime ? "Time" : "Points"}
    </Button>
  );
}
