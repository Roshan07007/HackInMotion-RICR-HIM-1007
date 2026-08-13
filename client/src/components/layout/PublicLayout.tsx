import { Outlet, Navigate } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../common/Loading";

const PublicLayout = () => {
  const { user, isCheckingAuth } = useAuthStore();

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
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
