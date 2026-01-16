import { useEffect, useState } from "react";
import TeacherLayout from "@/components/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherStatsApi } from "@/services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherAnalytics() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // For now, we'll just mock some data or use basic stats since we didn't build a dedicated detailed analytics backend.
        // In a real app, we'd fetch precise exam averages here.
        const loadData = async () => {
            try {
                await teacherStatsApi.get(); // Just to verify auth/connectivity
                // Mock data for charts
                setData([
                    { name: 'Exam 1', low: 45, avg: 72, high: 95 },
                    { name: 'Exam 2', low: 50, avg: 68, high: 88 },
                    { name: 'Quiz 1', low: 60, avg: 85, high: 100 },
                    { name: 'Midterm', low: 40, avg: 65, high: 92 },
                ]);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <TeacherLayout>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Results & Analytics</h1>
                    <p className="text-muted-foreground">Class performance overview across exams and assignments.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Exam Performance Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="avg" fill="#8884d8" name="Class Average" />
                                    <Bar dataKey="high" fill="#82ca9d" name="Highest Score" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Grade Distribution (Latest Exam)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">90-100% (A)</span>
                                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">15%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">80-89% (B)</span>
                                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">35%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">70-79% (C)</span>
                                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">25%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">60-69% (D)</span>
                                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">15%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">&lt; 60% (F)</span>
                                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">10%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TeacherLayout>
    );
}
