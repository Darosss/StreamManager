import "react-notifications-component/dist/theme.css";
import { SocketContextProvider } from "@socket";
import { RouterProvider } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";
import { allRoutes } from "@routes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "@redux/store";

const queryClient = new QueryClient();
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SocketContextProvider>
          <div className="main">
            <ReactNotifications />
            <RouterProvider router={allRoutes} />
          </div>
        </SocketContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
