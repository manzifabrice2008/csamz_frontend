import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { teacherAuthApi } from "@/services/api";

interface TeacherProtectedRouteProps {
  children: React.ReactNode;
}

export default function TeacherProtectedRoute({ children }: TeacherProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const isLoggedIn = teacherAuthApi.isAuthenticated();
    if (!isLoggedIn) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/teacher/login?redirect=${redirect}`, { replace: true });
      return;
    }

    const validateSession = async () => {
      try {
        await teacherAuthApi.getCurrentTeacher();
        if (active) {
          setAllowed(true);
        }
      } catch {
        teacherAuthApi.logout();
        if (active) {
          setAllowed(false);
          const redirect = encodeURIComponent(location.pathname + location.search);
          navigate(`/teacher/login?redirect=${redirect}`, { replace: true });
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
