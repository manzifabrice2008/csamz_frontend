import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { teacherAuthApi } from "@/services/api";
import { LogIn, Mail, Lock } from "lucide-react";

export default function TeacherLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (teacherAuthApi.isAuthenticated()) {
      navigate("/teacher/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await teacherAuthApi.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success) {
        if (response.teacher.status !== "approved") {
          toast({
            title: "Account not approved",
            description: "Your registration is still pending admin approval.",
            variant: "destructive",
          });
          teacherAuthApi.logout();
          setLoading(false);
          return;
        }

        toast({
          title: "Welcome, teacher!",
          description: `Logged in as ${response.teacher.full_name}`,
        });
        navigate("/teacher/dashboard", { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Invalid credentials or account not approved.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300" />
        </div>

        <Card className="w-full max-w-md shadow-2xl hover-lift animate-fadeInUp relative z-10">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-school-primary dark:bg-school-accent rounded-full flex items-center justify-center animate-float">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl">
              <span className="gradient-text">Teacher Login</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to manage exams and view assessment data once approved by an administrator.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" htmlFor="teacher-email">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input
                  id="teacher-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="teacher@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2" htmlFor="teacher-password">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <Input
                  id="teacher-password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90 transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have a teacher account yet?{" "}
                <Link
                  to="/teacher/register"
                  className="text-school-primary dark:text-school-accent font-semibold hover:underline"
                >
                  Register here
                </Link>
              </p>

              <p className="text-xs text-muted-foreground text-center">
                Looking for student access?{" "}
                <Link
                  to="/student/login"
                  className="text-school-primary dark:text-school-accent font-semibold hover:underline"
                >
                  Go to student login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}


