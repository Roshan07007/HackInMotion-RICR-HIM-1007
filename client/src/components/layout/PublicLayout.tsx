import { Suspense } from "react";
import { useOutlet, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../common/Loading";
import PageTransition from "../common/PageTransition";

const PublicLayout = () => {
  const { user, isCheckingAuth } = useAuthStore();

  const { pathname } = useLocation();
  const outlet = useOutlet();

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <Loading />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="bg-base-100 min-h-screen text-base-content selection:bg-primary/30 font-sans overflow-x-hidden">
      <Header />
      <AnimatePresence mode="wait">
        <PageTransition key={pathname}>
          <Suspense fallback={<div className="flex h-[70vh] w-full items-center justify-center"><Loading /></div>}>
            {outlet}
          </Suspense>
        </PageTransition>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default PublicLayout;
