import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { teacherAuthApi } from "@/services/api";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function TeacherRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    trade: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await teacherAuthApi.register({
        full_name: formData.full_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        trade: formData.trade.trim(),
        password: formData.password,
      });

      if (response.success) {
        toast({
          title: "Registration submitted",
          description: "An admin will review and approve your account before you can log in.",
        });
        navigate("/teacher/login", { replace: true });
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "Please check your details and try again.",
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

        <Card className="w-full max-w-2xl shadow-2xl hover-lift animate-fadeInUp relative z-10">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-school-primary dark:bg-school-accent rounded-full flex items-center justify-center animate-float">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl">
              <span className="gradient-text">Teacher Registration</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Register as a teacher to manage exams and holiday assessments. An admin will approve your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="teacher-full-name">Full name</Label>
                  <Input
                    id="teacher-full-name"
                    value={formData.full_name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, full_name: event.target.value }))}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-username">Username</Label>
                  <Input
                    id="teacher-username"
                    value={formData.username}
                    onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
                    placeholder="jane.doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="teacher-email"
                    type="email"
                    className="pl-9"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="teacher@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-trade">Trade / subject you teach</Label>
                  <Input
                    id="teacher-trade"
                    value={formData.trade}
                    onChange={(event) => setFormData((prev) => ({ ...prev, trade: event.target.value }))}
                    placeholder="e.g. Software Development"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="teacher-password"
                      type="password"
                      className="pl-9"
                      value={formData.password}
                      onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-confirm-password">Confirm password</Label>
                  <Input
                    id="teacher-confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-school-primary dark:bg-school-accent hover:bg-school-primary/90 dark:hover:bg-school-accent/90 transition"
              >
                {loading ? "Submitting registration..." : "Register as teacher"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Already registered?{" "}
                <Link to="/teacher/login" className="text-school-primary dark:text-school-accent font-semibold hover:underline">
                  Go to teacher login
                </Link>
              </p>

              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <User className="w-3 h-3" />
                Admin accounts are managed separately.{" "}
                <Link to="/admin/login" className="text-school-primary dark:text-school-accent font-semibold hover:underline">
                  Admin login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}


