import { Routes, Route } from "react-router-dom";
import Tags from "@components/modesList/tags";
import Moods from "@components/modesList/moods";
import Affixes from "@components/modesList/affixes";
import ComponentWithTitle from "@components/componentWithTitle";

export default function ModesRoutes() {
  return (
    <Routes>
      <Route
        path="moods"
        element={<ComponentWithTitle title="Moods" component={<Moods />} />}
      />
      <Route
        path="affixes"
        element={<ComponentWithTitle title="Affixes" component={<Affixes />} />}
      />
      <Route
        path="tags"
        element={<ComponentWithTitle title="Tags" component={<Tags />} />}
      />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
