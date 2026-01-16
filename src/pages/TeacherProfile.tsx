import { useEffect, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { teacherStatsApi, teacherAuthApi } from "@/services/api";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    BookOpen,
    Users,
    FileText,
    TrendingUp,
    Settings,
    Edit,
    GraduationCap,
    CheckSquare,
    Loader2
} from "lucide-react";

interface TeacherStats {
    totalStudents: number;
    totalAssignments: number;
    pendingGrading: number;
    totalExams: number;
    trade: string;
}

export default function TeacherProfile() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<any>(null);
    const [stats, setStats] = useState<TeacherStats>({
        totalStudents: 0,
        totalAssignments: 0,
        pendingGrading: 0,
        totalExams: 0,
        trade: "",
    });

    useEffect(() => {
        const loadTeacherData = async () => {
            try {
                setLoading(true);
                const [teacherRes, statsRes] = await Promise.all([
                    teacherAuthApi.getCurrentTeacher(),
                    teacherStatsApi.get()
                ]);

                if (teacherRes.success) {
                    setTeacher(teacherRes.teacher);
                }

                if (statsRes.success) {
                    setStats(statsRes.stats);
                }

            } catch (error) {
                console.error("Failed to load teacher profile:", error);
                toast({
                    title: "Error",
                    description: "Failed to load profile information.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadTeacherData();
    }, [toast]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <TeacherLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout>
            <div className="container mx-auto p-4 space-y-6 max-w-6xl">
                {/* Profile Header */}
                <Card className="overflow-hidden border-none shadow-md">
                    <div className="bg-gradient-to-r from-school-primary/80 to-school-accent/80 h-32"></div>
                    <CardContent className="relative pt-0 pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 px-4">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                <AvatarImage src="/placeholder-avatar.jpg" alt={teacher?.full_name} />
                                <AvatarFallback className="bg-school-primary text-primary-foreground text-3xl font-bold">
                                    {teacher?.full_name ? getInitials(teacher.full_name) : 'TE'}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0 mt-2 sm:mt-0 space-y-1">
                                <h1 className="text-3xl font-bold text-foreground">
                                    {teacher?.full_name || "Teacher Name"}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        {teacher?.trade || "Trade"} Instructor
                                    </span>
                                    <span>•</span>
                                    <span>ID: {teacher?.id || "N/A"}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                <Button asChild variant="outline" className="flex-1 sm:flex-none">
                                    <Link to="/teacher/settings">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Link>
                                </Button>
                                <Button asChild className="flex-1 sm:flex-none">
                                    <Link to="/teacher/settings">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Personal Information */}
                    <Card className="lg:col-span-2 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-school-primary" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Your personal details and credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                        <p className="font-medium">{teacher?.email || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Username</p>
                                        <p className="font-medium">{teacher?.username || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Department / Trade</p>
                                        <p className="font-medium">{teacher?.trade || "Not specified"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <CheckSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${teacher?.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {teacher?.status?.toUpperCase() || "UNKNOWN"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-school-primary" />
                                Overview
                            </CardTitle>
                            <CardDescription>Key performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/teacher/students" className="text-center p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors group">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                                    <div className="text-xs text-muted-foreground font-medium">Students</div>
                                </Link>

                                <Link to="/teacher/assignments" className="text-center p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors group">
                                    <FileText className="w-8 h-8 mx-auto mb-2 text-violet-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                                    <div className="text-xs text-muted-foreground font-medium">Assignments</div>
                                </Link>

                                <Link to="/teacher/exams" className="text-center p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors group">
                                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-amber-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold">{stats.totalExams}</div>
                                    <div className="text-xs text-muted-foreground font-medium">Exams</div>
                                </Link>

                                <div className="text-center p-4 bg-muted/40 rounded-xl">
                                    <CheckSquare className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                                    <div className="text-2xl font-bold">{stats.pendingGrading}</div>
                                    <div className="text-xs text-muted-foreground font-medium">Pending Grade</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="pt-2">
                                <Button asChild className="w-full" variant="secondary">
                                    <Link to="/teacher/dashboard">
                                        Go to Dashboard
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TeacherLayout>
    );
}
