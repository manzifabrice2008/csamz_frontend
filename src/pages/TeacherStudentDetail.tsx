import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherLayout from "@/components/TeacherLayout";
import { teacherStudentsApi, TeacherStudent } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, BookOpen, GraduationCap, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherStudentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<TeacherStudent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            if (!id) return;
            try {
                const response = await teacherStudentsApi.getById(Number(id));
                if (response.success) {
                    setStudent(response.student);
                }
            } catch (error) {
                console.error("Failed to fetch student details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <TeacherLayout>
                <div className="p-6 space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Card>
                        <CardHeader><Skeleton className="h-20 w-full" /></CardHeader>
                        <CardContent><Skeleton className="h-40 w-full" /></CardContent>
                    </Card>
                </div>
            </TeacherLayout>
        );
    }

    if (!student) {
        return (
            <TeacherLayout>
                <div className="p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Student not found</h2>
                        <Button onClick={() => navigate('/teacher/students')} className="mt-4">
                            Back to Students
                        </Button>
                    </div>
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout>
            <div className="p-6 space-y-6">
                <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/teacher/students')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Students
                </Button>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Sidebar / Profile Card */}
                    <Card className="w-full md:w-1/3">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        {student.full_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-2xl">{student.full_name}</CardTitle>
                            <CardDescription className="flex items-center justify-center gap-2 mt-2">
                                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                                    {student.status}
                                </Badge>
                                <span>ID: {student.id}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{student.email}</span>
                                </div>
                                {student.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{student.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize">{student.trade}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <span>{student.level || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {format(new Date(student.created_at), 'PPP')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content Areas */}
                    <div className="w-full md:w-2/3">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="academic">Academic</TabsTrigger>
                                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Performance Overview</CardTitle>
                                        <CardDescription>Recent activity and stats.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">Performance charts and activity feed will appear here.</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="academic" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Exam Results & Assignments</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">List of completed exams and submitted assignments.</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="attendance" className="mt-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Attendance History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">Attendance records for this student.</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
