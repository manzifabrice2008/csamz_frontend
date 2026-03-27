import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login, isAuthenticated } from "@/lib/auth";
import { API_BASE_URL } from "@/services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    let active = true;

    const validateSession = async () => {
      if (!isAuthenticated()) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session invalid");
        }

        if (active) {
          const redirectTo = searchParams.get("redirect");
          navigate(redirectTo || "/admin/overview", { replace: true });
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("adminUser");
      }
    };

    void validateSession();

    return () => {
      active = false;
    };
  }, [navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user info using auth utility
        login(data.token, data.user);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.full_name}!`,
        });

        // Redirect to admin overview
        const redirectTo = searchParams.get("redirect");
        navigate(redirectTo || "/admin/overview", { replace: true });
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <Card className="w-full max-w-md shadow-2xl hover-lift animate-fadeInUp relative z-10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-school-primary dark:bg-school-accent rounded-full flex items-center justify-center mb-4 animate-float">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl">
              <span className="gradient-text">Admin Login</span>
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to manage CSAM Zaccaria TVET
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="admin@csam.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90 transform hover:scale-105 transition-all duration-300"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Admin accounts are created by the system administrator.
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
