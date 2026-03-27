import { useEffect, useMemo, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { teacherAuthApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Lock, User, Mail, BadgeCheck, BellRing, BookOpen, Layers3 } from "lucide-react";

const tradeOptions = [
  "Software Development",
  "Computer System and Architecture",
  "Plumbing Technology",
  "Building Construction",
  "Wood Technology",
];

const levelOptions = [
  { value: "L3", label: "Level 3" },
  { value: "L4", label: "Level 4" },
  { value: "L5", label: "Level 5" },
] as const;

type TeacherLevel = "L3" | "L4" | "L5";

export default function TeacherSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    email: "",
    trades: [] as string[],
    levels: [] as TeacherLevel[],
  });
  const [preferences, setPreferences] = useState(() => ({
    emailNotifications: localStorage.getItem("teacher_settings_email_notifications") !== "false",
    examAlerts: localStorage.getItem("teacher_settings_exam_alerts") !== "false",
    studentUpdates: localStorage.getItem("teacher_settings_student_updates") !== "false",
  }));
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const response = await teacherAuthApi.getCurrentTeacher();
        if (response.success) {
          setProfile({
            full_name: response.teacher.full_name || "",
            username: response.teacher.username || "",
            email: response.teacher.email || "",
            trades: response.teacher.trades?.length
              ? response.teacher.trades
              : response.teacher.trade
                ? [response.teacher.trade]
                : [],
            levels: response.teacher.levels?.length
              ? response.teacher.levels
              : response.teacher.level
                ? [response.teacher.level]
                : ["L3"],
          });
        }
      } catch (error: any) {
        toast({
          title: "Failed to load settings",
          description: error?.message || "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTeacher();
  }, [toast]);

  const teacherStatus = useMemo(() => {
    const teacher = teacherAuthApi.getStoredTeacher();
    return teacher?.status || "approved";
  }, [loading]);

  const toggleTrade = (trade: string, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      trades: checked ? [...prev.trades, trade] : prev.trades.filter((item) => item !== trade),
    }));
  };

  const toggleLevel = (level: TeacherLevel, checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      levels: checked ? [...prev.levels, level] : prev.levels.filter((item) => item !== level),
    }));
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profile.full_name.trim() || !profile.username.trim() || !profile.email.trim()) {
      toast({
        title: "Missing information",
        description: "Full name, username, and email are required.",
        variant: "destructive",
      });
      return;
    }

    if (profile.trades.length === 0) {
      toast({
        title: "Select trades",
        description: "Choose at least one trade you teach.",
        variant: "destructive",
      });
      return;
    }

    if (profile.levels.length === 0) {
      toast({
        title: "Select classes",
        description: "Choose at least one class level you teach.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingProfile(true);
      await teacherAuthApi.updateProfile({
        full_name: profile.full_name.trim(),
        username: profile.username.trim(),
        email: profile.email.trim(),
        trades: profile.trades,
        levels: profile.levels,
      });

      toast({
        title: "Settings updated",
        description: "Your teacher account details were saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to save settings",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (passwordForm.new_password.length < 6) {
      toast({
        title: "Password too short",
        description: "Use at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast({
        title: "Passwords do not match",
        description: "Confirm the new password correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingPassword(true);
      await teacherAuthApi.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      toast({
        title: "Password updated",
        description: "Your password was changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to change password",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePreferenceToggle = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: checked };
      localStorage.setItem(`teacher_settings_${key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)}`, String(checked));
      return next;
    });
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="rounded-2xl border border-school-primary/20 bg-gradient-to-r from-school-primary/10 via-background to-school-accent/10 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Teacher Settings</h1>
              <p className="text-muted-foreground">
                Manage your profile, teaching assignments, security, and notification preferences.
              </p>
            </div>
            <Badge variant="outline" className="w-fit px-3 py-1 text-sm">
              <BadgeCheck className="mr-2 h-4 w-4" />
              Status: {teacherStatus}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr,0.9fr]">
          <Card className="border-school-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-school-primary" />
                Profile & Teaching Setup
              </CardTitle>
              <CardDescription>
                Edit your basic account details, trades, and class levels you teach.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-full-name">Full name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="teacher-full-name"
                        value={profile.full_name}
                        onChange={(event) => setProfile((prev) => ({ ...prev, full_name: event.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-username">Username</Label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="teacher-username"
                        value={profile.username}
                        onChange={(event) => setProfile((prev) => ({ ...prev, username: event.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="teacher-email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="teacher-email"
                        type="email"
                        value={profile.email}
                        onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-school-primary" />
                    <h3 className="font-semibold">Trades You Teach</h3>
                  </div>
                  <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 md:grid-cols-2">
                    {tradeOptions.map((trade) => (
                      <label key={trade} className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition hover:border-school-primary/30 hover:bg-background/70">
                        <Checkbox
                          checked={profile.trades.includes(trade)}
                          onCheckedChange={(checked) => toggleTrade(trade, checked === true)}
                        />
                        <span className="text-sm">{trade}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4 text-school-primary" />
                    <h3 className="font-semibold">Class Levels You Teach</h3>
                  </div>
                  <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 md:grid-cols-3">
                    {levelOptions.map((level) => (
                      <label key={level.value} className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition hover:border-school-primary/30 hover:bg-background/70">
                        <Checkbox
                          checked={profile.levels.includes(level.value)}
                          onCheckedChange={(checked) => toggleLevel(level.value, checked === true)}
                        />
                        <span className="text-sm">{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={savingProfile}>
                    {savingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-school-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-school-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Turn reminders and classroom activity alerts on or off for this browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">Receive reminders about student activity and updates.</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceToggle("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
                  <div>
                    <p className="font-medium">Exam alerts</p>
                    <p className="text-sm text-muted-foreground">Stay informed when students complete online exams.</p>
                  </div>
                  <Switch
                    checked={preferences.examAlerts}
                    onCheckedChange={(checked) => handlePreferenceToggle("examAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
                  <div>
                    <p className="font-medium">Student updates</p>
                    <p className="text-sm text-muted-foreground">Show reminders when new students appear in your assigned classes.</p>
                  </div>
                  <Switch
                    checked={preferences.studentUpdates}
                    onCheckedChange={(checked) => handlePreferenceToggle("studentUpdates", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-school-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-school-primary" />
                  Security
                </CardTitle>
                <CardDescription>
                  Change your password to keep your teacher account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, current_password: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, new_password: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, confirm_password: event.target.value }))
                      }
                      required
                    />
                  </div>

                  <Button type="submit" disabled={savingPassword} className="w-full">
                    {savingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
