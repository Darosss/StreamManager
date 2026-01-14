import { SocketContextProvider } from "@socket";
import { RouterProvider } from "react-router-dom";
import { allRoutes } from "@routes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import { NotificationsContextProvider } from "@contexts";

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
