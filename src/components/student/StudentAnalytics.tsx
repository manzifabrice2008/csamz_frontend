import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentAnalyticsApi, StudentStats, StudentPerformancePoint } from "@/services/api";
import { Loader2, TrendingUp, Award, Calendar, BookOpen } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function StudentAnalytics() {
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [performanceData, setPerformanceData] = useState<StudentPerformancePoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, perfRes] = await Promise.all([
                    studentAnalyticsApi.getStats(),
                    studentAnalyticsApi.getPerformance()
                ]);
                setStats(statsRes.stats);
                setPerformanceData(perfRes.performanceData);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 font-medium mb-1">Attendance Rate</p>
                                <h3 className="text-4xl font-bold">{stats?.attendance}%</h3>
                                <p className="text-sm text-blue-100 mt-2 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {stats?.present_attendance_days} days present
                                </p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white/90 rounded-full transition-all duration-1000"
                                style={{ width: `${stats?.attendance}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-violet-100 font-medium mb-1">Avg. Grade</p>
                                <h3 className="text-4xl font-bold">{stats?.grades}%</h3>
                                <p className="text-sm text-violet-100 mt-2 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    Across all exams
                                </p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white/90 rounded-full transition-all duration-1000"
                                style={{ width: `${stats?.grades}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-emerald-100 font-medium mb-1">Assignments</p>
                                <h3 className="text-4xl font-bold">{stats?.assignments}%</h3>
                                <p className="text-sm text-emerald-100 mt-2 flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    Completion rate
                                </p>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white/90 rounded-full transition-all duration-1000"
                                style={{ width: `${stats?.assignments}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                    <CardDescription>Your grades over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
