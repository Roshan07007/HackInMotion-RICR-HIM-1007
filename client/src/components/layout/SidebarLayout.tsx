import { useEffect, Suspense } from "react";
import { useOutlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loading from "../common/Loading";
import SidebarHeader from "../ui/SidebarHeader";
import Sidebar from "../ui/Sidebar";
import { useUiStore } from "../../store/useUiStore";
import appConfig from "../../config/appConfig";
import { lastSetHeaderPathname } from "../../utils/setHeader";
import PageTransition from "../common/PageTransition";

const SidebarLayout = () => {
  const { headerTitle, headerActions, setHeaderTitle, setHeaderActions,layoutClass } =
    useUiStore();
  const { pathname } = useLocation();
  const outlet = useOutlet();

  // Reset header title and actions whenever the route shifts,
  // EXCEPT if the child component already set it for this route.
  useEffect(() => {
    if (lastSetHeaderPathname !== pathname) {
      // We only clear the actions. We intentionally do NOT clear the title 
      // so it doesn't flash the app name while lazy-loading the next chunk.
      setHeaderActions(null);
    }
  }, [pathname, setHeaderActions]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SidebarHeader title={headerTitle} actions={headerActions} />

        <main
          className={`flex-1 h-full overflow-y-auto ${layoutClass}`}
          data-lenis-prevent
        >
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>
              <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loading /></div>}>
                {outlet}
              </Suspense>
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
