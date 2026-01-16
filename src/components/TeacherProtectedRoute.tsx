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
    const isLoggedIn = teacherAuthApi.isAuthenticated();
    if (!isLoggedIn) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/teacher/login?redirect=${redirect}`);
      return;
    }

    setAllowed(true);
  }, [location.pathname, location.search, navigate]);

  if (allowed === null) {
    return null;
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}

