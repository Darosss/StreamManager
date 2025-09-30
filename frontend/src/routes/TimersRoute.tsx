import { Routes, Route } from "react-router-dom";
import TimersList from "@components/timersList";
import ComponentWithTitle from "@components/componentWithTitle";

export default function TimersRoute() {
  return (
    <Routes>
      <Route
        element={
          <ComponentWithTitle title="Timers" component={<TimersList />} />
        }
      >
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
