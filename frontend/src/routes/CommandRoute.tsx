import { Routes, Route } from "react-router-dom";
import CommandsList from "@components/commandsList";
import ComponentWithTitle from "@components/componentWithTitle";

export default function CommandRoutes() {
  return (
    <Routes>
      <Route
        index
        element={
          <ComponentWithTitle
            title="Chat commands"
            component={<CommandsList />}
          />
        }
      />
      <Route path="*" element={<>Not found</>} />
    </Routes>
  );
}
