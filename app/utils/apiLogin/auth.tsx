import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired, logout } from "./authApi"; // Importamos la función de expiración y logout

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function AuthComponent(props: any) {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token || isTokenExpired()) {
        logout();
        navigate("/login", { replace: true });
      }

      const handlePopState = () => {
        if (window.history.state && window.location.pathname === "/login") {
          logout();
          navigate("/login", { replace: true });
        }
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible" && window.location.pathname === "/login") {
          logout();
          navigate("/login", { replace: true });
        }
      };

      window.addEventListener("popstate", handlePopState);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
