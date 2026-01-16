import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { studentAuthApi } from "@/services/api";
import { UserPlus, User, Mail, Lock, GraduationCap } from "lucide-react";

const tradeOptions = [
  "Software Development",
  "Computer Systems and Networks",
  "Plumbing Technology",
  "Building Construction",
  "Wood Technology",
];

export default function StudentRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    trade: "",
    level: "L3" as 'L3' | 'L4' | 'L5', // Explicitly type the level field
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.phone_number.trim()) {
      toast({ title: "Phone number is required", variant: "destructive" });
      return;
    }

    if (!formData.trade) {
      toast({ title: "Select your trade", variant: "destructive" });
      return;
    }

    if (!formData.level) {
      toast({ title: "Select your level", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...registrationData } = formData;
      // Ensure level is one of the allowed values
      registrationData.level = ['L1', 'L2', 'L3', 'L4', 'L5'].includes(formData.level) 
        ? formData.level 
        : 'L3';
      const response = await studentAuthApi.register({
        username: formData.username.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        email: formData.email.trim() || undefined,
        phone_number: formData.phone_number.trim(),
        trade: formData.trade,
        level: registrationData.level,
      });

      if (response.success) {
        toast({ title: "Registration successful", description: "Welcome to the holiday assessments portal!" });
        navigate("/student/dashboard", { replace: true });
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
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-school-primary rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-float delay-300"></div>
        </div>

        <Card className="w-full max-w-2xl shadow-2xl hover-lift animate-fadeInUp relative z-10">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-school-primary dark:bg-school-accent rounded-full flex items-center justify-center animate-float">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl">
              <span className="gradient-text">Student Registration</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account to access trade-specific holiday assessments and track your progress.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input
                    id="full-name"
                    value={formData.full_name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, full_name: event.target.value }))}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
                    placeholder="jane.doe"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="student@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trade">Trade</Label>
                  <Select value={formData.trade} onValueChange={(value) => setFormData((prev) => ({ ...prev, trade: value }))}>
                    <SelectTrigger id="trade">
                      <SelectValue placeholder="Select your trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {tradeOptions.map((trade) => (
                        <SelectItem key={trade} value={trade}>
                          {trade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: 'L3' | 'L4' | 'L5') =>
                      setFormData({ ...formData, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L3">Level 3</SelectItem>
                      <SelectItem value="L4">Level 4</SelectItem>
                      <SelectItem value="L5">Level 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(event) => setFormData((prev) => ({ ...prev, phone_number: event.target.value }))}
                    placeholder="e.g. 0788 000 000"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
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
                {loading ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link to="/student/login" className="text-school-primary dark:text-school-accent font-semibold hover:underline">
                  Go to login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
