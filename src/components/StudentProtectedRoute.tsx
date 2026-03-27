import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { studentAuthApi } from "@/services/api";

interface StudentProtectedRouteProps {
  children: React.ReactNode;
}

export default function StudentProtectedRoute({ children }: StudentProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const isLoggedIn = studentAuthApi.isAuthenticated();
    if (!isLoggedIn) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/student/login?redirect=${redirect}`, { replace: true });
      return;
    }

    const validateSession = async () => {
      try {
        await studentAuthApi.getCurrentStudent();
        if (active) {
          setAllowed(true);
        }
      } catch {
        studentAuthApi.logout();
        if (active) {
          setAllowed(false);
          const redirect = encodeURIComponent(location.pathname + location.search);
          navigate(`/student/login?redirect=${redirect}`, { replace: true });
        }
      }
    };

    void validateSession();

    return () => {
      active = false;
    };
  }, [location.pathname, location.search, navigate]);

  if (allowed === null) {
    return null;
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
