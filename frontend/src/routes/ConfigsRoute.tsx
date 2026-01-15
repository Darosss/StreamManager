import { Routes, Route } from "react-router";
import ConfigsList from "@components/configsList";
import ComponentWithTitle from "@components/componentWithTitle";

export default function ConfigRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <ComponentWithTitle title="Configs" component={<ConfigsList />} />
        }
      />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
