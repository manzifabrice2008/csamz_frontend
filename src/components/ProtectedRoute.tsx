import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/services/api";
import { logout } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const validateSession = async () => {
      if (!authApi.isAuthenticated()) {
        const redirect = encodeURIComponent(location.pathname + location.search);
        navigate(`/admin/login?redirect=${redirect}`, { replace: true });
        return;
      }

      try {
        await authApi.getCurrentUser();
        if (active) {
          setAllowed(true);
        }
      } catch {
        logout();
        if (active) {
          setAllowed(false);
          const redirect = encodeURIComponent(location.pathname + location.search);
          navigate(`/admin/login?redirect=${redirect}`, { replace: true });
        }
      }
    };

    void validateSession();

    return () => {
      active = false;
    };
  }, [location.pathname, location.search, navigate]);

  if (allowed !== true) {
    return null;
  }

  return <>{children}</>;
}
