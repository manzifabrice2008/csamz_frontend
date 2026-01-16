import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  BookOpen,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Home,
  Award,
  Bell
} from "lucide-react";
import { studentAuthApi, studentNotificationsApi } from "@/services/api";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const student = studentAuthApi.getStoredStudent();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await studentNotificationsApi.getAll();
        setUnreadCount(res.unreadCount);
      } catch (e) {
        console.error("Failed to fetch notifications count", e);
      }
    };
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    studentAuthApi.logout();
    navigate("/student/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
      description: "Overview & quick access",
    },
    {
      name: "My Exams",
      path: "/student/exams",
      icon: ClipboardList,
      description: "Available online exams",
    },
    {
      name: "Results",
      path: "/student/results",
      icon: BarChart3,
      description: "View your exam results",
    },
    {
      name: "Profile",
      path: "/student/profile",
      icon: User,
      description: "Manage your profile",
    },
    {
      name: "Settings",
      path: "/student/settings",
      icon: Settings,
      description: "Account settings",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/student/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold text-school-primary dark:text-school-accent">
              CSAMZ Student Portal
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/student/dashboard')}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse ring-2 ring-background" />
            )}
          </Button>

          {/* Student Info */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">{student?.full_name || "Student"}</div>
              <div className="text-xs text-muted-foreground">
                {student?.trade || "Student"} • ID: {student?.id || "N/A"}
              </div>
            </div>

            <Avatar className="h-8 w-8 border-2 border-school-primary">
              <AvatarFallback className="bg-school-primary/10 text-school-primary text-xs font-semibold">
                {student?.full_name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
          </div>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${active
                  ? "bg-school-primary text-white dark:bg-school-accent"
                  : "hover:bg-muted"
                  }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${active ? "text-white" : ""}`} />
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${active ? "text-white" : ""}`}>
                    {item.name}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${active ? "text-white/80" : "text-muted-foreground"
                      }`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Student Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="bg-muted rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-school-primary" />
              <span className="text-sm font-medium">Quick Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-background rounded">
                <div className="font-medium">85%</div>
                <div className="text-muted-foreground">Avg Score</div>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <div className="font-medium">12</div>
                <div className="text-muted-foreground">Exams Taken</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : ""
          }`}
      >
        <div className="min-h-[calc(100vh-4rem)]">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
