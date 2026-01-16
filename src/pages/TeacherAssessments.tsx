import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function TeacherAssessments() {
    return (
        <TeacherLayout>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assessment Tools</h1>
                    <p className="text-muted-foreground">Manage holiday assessments and other evaluation tools</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Holiday Assignments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Create and manage assignments for holiday periods.</p>
                            <Button className="w-full">Manage</Button>
                        </CardContent>
                    </Card>

                    {/* Add more assessment tools here */}
                </div>
            </div>
        </TeacherLayout>
    );
}
