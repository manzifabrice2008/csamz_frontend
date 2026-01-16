import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { logout, getUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  BarChart3,
  MessageSquare,
  ListChecks,
  PenSquare,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getUser();

  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const navItems = [
    {
      name: "Overview",
      path: "/admin/overview",
      icon: BarChart3,
      description: "Website statistics & analytics",
    },
    {
      name: "Applications",
      path: "/admin/applications",
      icon: Users,
      description: "Student applications",
    },
    {
      name: "Testimonials",
      path: "/admin/testimonials",
      icon: MessageSquare,
      description: "Manage testimonials",
    },
    {
      name: "Teachers",
      path: "/admin/teachers",
      icon: Users,
      description: "Approve or reject teacher accounts",
    },
    {
      name: "News & Updates",
      path: "/admin/dashboard",
      icon: Newspaper,
      description: "Manage news articles",
    },
    {
      name: "Blog",
      path: "/admin/blog",
      icon: PenSquare,
      description: "Manage blog posts",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
      description: "Admin settings",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

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
              CSAMZ Admin Portal
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
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
        className={`fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                  active
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
                    className={`text-xs mt-0.5 ${
                      active ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm font-medium">{currentUser?.full_name || "Admin User"}</div>
            <div className="text-xs text-muted-foreground">
              {currentUser?.email || "admin@csam.edu"}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "lg:pl-64" : ""
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
