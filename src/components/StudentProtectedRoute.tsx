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
    const isLoggedIn = studentAuthApi.isAuthenticated();
    if (!isLoggedIn) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/student/login?redirect=${redirect}`);
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
