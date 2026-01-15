import { Routes, Route } from "react-router";
import ComponentWithTitle from "@components/componentWithTitle";
import SongsList from "@components/songsList";

export default function SongsRoutes() {
  return (
    <Routes>
      <Route
        element={<ComponentWithTitle title="Songs" component={<SongsList />} />}
      >
        <Route path="*" element={<>Not found</>} />
      </Route>
    </Routes>
  );
}
