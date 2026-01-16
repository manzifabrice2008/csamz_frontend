import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home, Info, GraduationCap, Newspaper, Mail, PenSquare, Image, ChevronUp, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import Logo from "./Logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { studentAuthApi, teacherAuthApi } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SchoolHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const student = useMemo(() => studentAuthApi.getStoredStudent(), []);
  const teacher = useMemo(() => teacherAuthApi.getStoredTeacher(), []);
  const activeUser = teacher || student;

  const programs = [
    { to: "/programs/software-development", label: t("softwareDevelopment") },
    { to: "/programs/computer-systems", label: t("computerSystems") },
    { to: "/programs/plumbing-technology", label: t("plumbingTechnology") },
    { to: "/programs/building-construction", label: t("buildingConstruction") },
    { to: "/programs/wood-technology", label: t("woodTechnology") },
  ];

  const bottomLinks = [
    { to: "/", label: t("home"), Icon: Home },
    { to: "/about", label: t("about"), Icon: Info },
    { to: "/programs", label: t("programs"), Icon: GraduationCap, isDropdown: true },
    { to: "/news", label: t("news"), Icon: Newspaper },
    { to: "/blog", label: "Blog", Icon: PenSquare },
    { to: "/gallery", label: t("gallery") ?? "Gallery", Icon: Image },
    { to: "/contact", label: t("contact"), Icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "transition-all duration-300 relative group";
    const activeClasses = "text-school-primary dark:text-school-accent font-semibold";
    const inactiveClasses = "text-foreground hover:text-school-primary dark:hover:text-school-accent";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const userInitial =
    (activeUser?.full_name?.charAt(0) || activeUser?.username?.charAt(0) || "").toUpperCase() || null;

  const handleUserLogout = () => {
    if (teacher) {
      teacherAuthApi.logout();
      window.location.href = "/teacher/login";
      return;
    }
    if (student) {
      studentAuthApi.logout();
      window.location.href = "/student/login";
      return;
    }
  };

  const goToSettings = () => {
    if (teacher) {
      window.location.href = "/teacher/settings";
      return;
    }
    if (student) {
      window.location.href = "/student/settings";
      return;
    }
  };

  return (
    <>
      <header className="bg-background/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-50 animate-fadeInDown">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Logo size="md" showText={true} />
            </Link>

            <nav className="hidden lg:flex items-center space-x-4 lg:space-x-6">
              <Link to="/" className={getLinkClasses("/")}>
                <span>{t('home')}</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-school-primary dark:bg-school-accent transition-all duration-300 ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
              <Link to="/about" className={getLinkClasses("/about")}>
                <span>{t('about')}</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-school-primary dark:bg-school-accent transition-all duration-300 ${isActive("/about") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>{t('programs')}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/programs/software-development" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{t('softwareDevelopment')}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Web & mobile app development
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/programs/computer-systems" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{t('computerSystems')}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Hardware & networking
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/programs/plumbing-technology" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{t('plumbingTechnology')}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Modern plumbing systems
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/programs/building-construction" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{t('buildingConstruction')}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Construction techniques
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link to="/programs/wood-technology" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{t('woodTechnology')}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Carpentry & furniture making
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link to="/news" className={getLinkClasses("/news")}>
                <span>{t('news')}</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-school-primary dark:bg-school-accent transition-all duration-300 ${isActive("/news") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
              <Link to="/blog" className={getLinkClasses("/blog")}>
                <span>Blog</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-school-primary dark:bg-school-accent transition-all duration-300 ${isActive("/blog") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
              <Link to="/gallery" className={getLinkClasses("/gallery")}>
                <span>{t('gallery') ?? 'Gallery'}</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-school-primary dark:bg-school-accent transition-all duration-300 ${isActive("/gallery") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
              <Link to="/contact" className={getLinkClasses("/contact")}>
                <span>{t('contact')}</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-school-primary dark:bg-school-accent transition-all duration-300 ${isActive("/contact") ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
              <LanguageSelector />
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-school-primary/40 bg-white text-sm font-semibold text-school-primary shadow-sm transition hover:bg-school-primary/10 dark:border-school-accent/60 dark:bg-transparent dark:text-school-accent"
                      aria-label="Account menu"
                    >
                      {userInitial || <User className="h-5 w-5" />}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {activeUser ? (
                        <div className="space-y-1">
                          <div className="font-semibold">{activeUser.full_name || activeUser.username}</div>
                          <p className="text-xs text-muted-foreground">
                            {teacher ? t("teacher") ?? "Teacher" : t("student") ?? "Student"}
                          </p>
                        </div>
                      ) : (
                        t("account") ?? "Account"
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {activeUser && (
                      <DropdownMenuItem asChild>
                        <Link to={teacher ? "/teacher/dashboard" : "/student/dashboard"}>
                          {t("dashboard") ?? "Dashboard"}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={goToSettings} disabled={!activeUser}>
                      {t("settings") ?? "Settings"}
                    </DropdownMenuItem>
                    {activeUser ? (
                      <DropdownMenuItem onClick={handleUserLogout} className="text-destructive">
                        {t("logout") ?? "Logout"}
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => (window.location.href = "/student/login")}>
                          {t("studentLogin") ?? "Student Login"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => (window.location.href = "/teacher/login")}>
                          {t("teacherLogin") ?? "Teacher Login"}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="default"
                  className="bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                  asChild
                >
                  <Link to="/apply">{t("apply")}</Link>
                </Button>
              </div>
            </nav>

            <div className="lg:hidden flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="lg:hidden h-16" />

      {/* Programs Dropdown Menu */}
      {programsDropdownOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setProgramsDropdownOpen(false)}
          />
          <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background/98 backdrop-blur-md border-t shadow-2xl z-50 animate-slideInUp">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-school-primary dark:text-school-accent">
                  {t("programs")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProgramsDropdownOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {programs.map((program) => {
                  const active = isActive(program.to);
                  return (
                    <Link
                      key={program.to}
                      to={program.to}
                      onClick={() => setProgramsDropdownOpen(false)}
                      className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${active
                          ? "bg-school-primary text-white dark:bg-school-accent shadow-lg"
                          : "bg-muted/50 hover:bg-muted"
                        }`}
                    >
                      <span className="font-medium">{program.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t shadow-lg z-50">
        <nav className="flex justify-between items-stretch px-2">
          {bottomLinks.map(({ to, label, Icon, isDropdown }) => {
            const active = isActive(to);

            if (isDropdown) {
              return (
                <button
                  key={to}
                  onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
                  className={`flex flex-col items-center flex-1 py-2 px-1 text-[11px] font-medium transition-all duration-200 ${active || programsDropdownOpen
                      ? "text-school-primary dark:text-school-accent"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className={`h-5 w-5 mb-1 ${active || programsDropdownOpen ? "scale-110" : ""}`} />
                  <span className="truncate">{label}</span>
                </button>
              );
            }

            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center flex-1 py-2 px-1 text-[11px] font-medium transition-all duration-200 ${active ? "text-school-primary dark:text-school-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${active ? "scale-110" : ""}`} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default SchoolHeader;