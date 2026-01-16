import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentAttendanceApi, StudentAttendance as IStudentAttendance } from "@/services/api";
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function StudentAttendance() {
    const [attendance, setAttendance] = useState<IStudentAttendance[]>([]);
    const [summary, setSummary] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historyRes, summaryRes] = await Promise.all([
                    studentAttendanceApi.getHistory(),
                    studentAttendanceApi.getSummary()
                ]);
                setAttendance(historyRes.attendance);
                setSummary(summaryRes.summary);
            } catch (error) {
                console.error("Failed to load attendance", error);
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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'present':
                return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Present' };
            case 'absent':
                return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Absent' };
            case 'late':
                return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Late' };
            case 'excused':
                return { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Excused' };
            default:
                return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: status };
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['present', 'absent', 'late', 'excused'].map((status) => {
                    const config = getStatusConfig(status);
                    const Icon = config.icon;
                    return (
                        <Card key={status} className="border-none shadow-sm bg-muted/30">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground capitalize">{status}</p>
                                    <p className={cn("text-2xl font-bold", config.color)}>{summary[status] || 0}</p>
                                </div>
                                <div className={cn("p-2 rounded-full", config.bg)}>
                                    <Icon className={cn("w-5 h-5", config.color)} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                    <CardDescription>Daily record of your class attendance</CardDescription>
                </CardHeader>
                <CardContent>
                    {attendance.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No attendance records found.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {attendance.map((record) => {
                                const config = getStatusConfig(record.status);
                                const date = new Date(record.date);
                                return (
                                    <div key={record.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors border-b last:border-0 border-dashed">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-12 h-12 rounded-lg flex flex-col items-center justify-center border bg-card shadow-sm")}>
                                                <span className="text-xs font-medium text-muted-foreground uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-lg font-bold">{date.getDate()}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{date.toLocaleDateString(undefined, { weekday: 'long' })}</p>
                                                <p className="text-xs text-muted-foreground">{date.getFullYear()}</p>
                                                {record.remarks && (
                                                    <p className="text-xs text-muted-foreground italic mt-1">"{record.remarks}"</p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn("capitalize px-3 py-1", config.color, config.bg, "border-none")}>
                                            {config.label}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
