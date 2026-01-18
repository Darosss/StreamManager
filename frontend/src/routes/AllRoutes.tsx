import { lazy } from "react";
import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";

import OverlayList from "@components/overlay/overlaysList";
const Home = lazy(() => import("@components/home"));
const SideBar = lazy(() => import("@components/sideBar"));
const ComponentWithTitle = lazy(() => import("@components/componentWithTitle"));

// Routes
const MessageRoutes = lazy(() => import("./MessageRoute"));
const CommandRoutes = lazy(() => import("./CommandRoute"));
const ConfigRoutes = lazy(() => import("./ConfigsRoute"));
const EventRoutes = lazy(() => import("./EventsRoute"));
const MessageCategoriesRoute = lazy(() => import("./MessageCategoriesRoute"));
const ModesRoutes = lazy(() => import("./ModeRoute"));
const RedemptionRoutes = lazy(() => import("./RedemptionRoute"));
const SongsRoutes = lazy(() => import("./SongsRoute"));
const StreamSessionRoutes = lazy(() => import("./StreamSessionRoute"));
const TimersRoute = lazy(() => import("./TimersRoute"));
const TriggerRoutes = lazy(() => import("./TriggerRoute"));
const UserRoutes = lazy(() => import("./UserRoute"));
const OverlayRoutes = lazy(() => import("./OverlayRoute"));
const AchievementsRoutes = lazy(() => import("./AchievementsRoute"));

const DefaultRouteLayout = () => (
  <div className="main-content">
    <Outlet />
    <SideBar />
  </div>
);

const HomeLayout = () => (
  <div className="main-content">
    <Outlet />
  </div>
);

const OverlayLayout = () => (
  <div className="main-overlay">
    <Outlet />
  </div>
);

export const allRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<OverlayLayout />}>
        <Route path="/overlay/*" element={<OverlayRoutes />} />
      </Route>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<DefaultRouteLayout />}>
        <Route path="/achievements/*" element={<AchievementsRoutes />} />
        <Route
          path="/overlay"
          element={
            <ComponentWithTitle title="Overlays" component={<OverlayList />} />
          }
        />

        <Route path="/users/*" element={<UserRoutes />} />
        <Route path="/messages/*" element={<MessageRoutes />} />
        <Route
          path="/message-categories/*"
          element={<MessageCategoriesRoute />}
        />
        <Route path="/commands/*" element={<CommandRoutes />} />
        <Route path="/events/*" element={<EventRoutes />} />
        <Route path="/modes/*" element={<ModesRoutes />} />
        <Route path="/redemptions/*" element={<RedemptionRoutes />} />
        <Route path="/stream-sessions/*" element={<StreamSessionRoutes />} />
        <Route path="/songs/*" element={<SongsRoutes />} />
        <Route path="/timers/*" element={<TimersRoute />} />
        <Route path="/triggers/*" element={<TriggerRoutes />} />
        <Route path="/configs/*" element={<ConfigRoutes />} />
        <Route path="/*" element={<>Not found</>} />
      </Route>
    </Route>,
  ),
);
