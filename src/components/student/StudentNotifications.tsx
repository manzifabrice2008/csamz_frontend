import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentNotificationsApi, StudentNotification } from "@/services/api";
import { Loader2, Bell, Check, Info, AlertTriangle, CheckCircle, AlertOctagon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StudentNotifications() {
    const [notifications, setNotifications] = useState<StudentNotification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await studentNotificationsApi.getAll();
            setNotifications(response.notifications);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkRead = async (id: number) => {
        try {
            await studentNotificationsApi.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await studentNotificationsApi.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-school-primary" />
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'error': return <AlertOctagon className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-4 animate-fadeIn max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                </h2>
                {notifications.some(n => !n.is_read) && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                        <Check className="w-4 h-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                            <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p>No new notifications</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={cn(
                                    "transition-all duration-200 hover:shadow-md border-l-4",
                                    !notification.is_read ? "border-l-school-primary bg-blue-50/50" : "border-l-transparent opacity-80"
                                )}
                            >
                                <CardContent className="p-4 flex gap-4">
                                    <div className="mt-1">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={cn("font-medium", !notification.is_read && "text-school-primary")}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {notification.message}
                                        </p>
                                        {!notification.is_read && (
                                            <div className="pt-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-xs px-2"
                                                    onClick={() => handleMarkRead(notification.id)}
                                                >
                                                    Mark as read
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
