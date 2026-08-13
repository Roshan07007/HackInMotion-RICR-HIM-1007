import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarHeader from "../ui/SidebarHeader";
import Sidebar from "../ui/Sidebar";
import { useUiStore } from "../../store/useUiStore";
import appConfig from "../../config/appConfig";
import { lastSetHeaderPathname } from "../../utils/setHeader";

const SidebarLayout = () => {
  const { headerTitle, headerActions, setHeaderTitle, setHeaderActions,layoutClass } =
    useUiStore();
  const { pathname } = useLocation();

  // Reset header title and actions whenever the route shifts,
  // EXCEPT if the child component already set it for this route.
  useEffect(() => {
    if (lastSetHeaderPathname !== pathname) {
      setHeaderTitle(appConfig.app.name);
      setHeaderActions(null);
    }
  }, [pathname, setHeaderTitle, setHeaderActions]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SidebarHeader title={headerTitle} actions={headerActions} />

        <main
          className={`flex-1 h-full overflow-y-auto ${layoutClass}`}
          data-lenis-prevent
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
