import { SocketContextProvider } from "@socket";
import { RouterProvider } from "react-router-dom";
import { allRoutes } from "@routes";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import { NotificationsContextProvider } from "@contexts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SocketContextProvider>
          <div className="main">
            <NotificationsContextProvider>
              <RouterProvider router={allRoutes} />
            </NotificationsContextProvider>
          </div>
        </SocketContextProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
