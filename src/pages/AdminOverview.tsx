import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Newspaper,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  FileText,
  UserCheck2,
  Eye,
  TrendingDown,
} from "lucide-react";
import { applicationsApi, newsApi, teacherAdminApi, analyticsApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [stats, setStats] = useState({
    applications: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      thisMonth: 0,
    },
    news: {
      total: 0,
      thisMonth: 0,
      categories: {} as Record<string, number>,
    },
    teachers: {
      total: 0,
      pending: 0,
    },
    visitors: {
      monthly: 0,
      total: 0,
      trend: 0,
    },
    recentActivity: [] as any[],
  });

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);

      // Fetch applications stats
      const appsResponse = await applicationsApi.getStats();
      const appsListResponse = await applicationsApi.getAll();

      // Fetch news stats
      const newsResponse = await newsApi.getAll();

      // Fetch analytics stats
      let analyticsData = { monthly_visitors: 0, total_visitors: 0, trend: 0 };
      try {
        const analyticsResponse = await analyticsApi.getOverview();
        if (analyticsResponse.success) {
          analyticsData = analyticsResponse.stats;
        }
      } catch (err) {
        console.warn('Analytics failed to load:', err);
      }

      // Fetch teachers stats
      const teachersResponse = await teacherAdminApi.list();
      const pendingTeachers = (teachersResponse.teachers || []).filter(t => t.status === 'pending').length;

      // Calculate this month's applications
      const now = new Date();
      const thisMonthApps = appsListResponse.applications.filter((app: any) => {
        const appDate = new Date(app.created_at);
        return appDate.getMonth() === now.getMonth() &&
          appDate.getFullYear() === now.getFullYear();
      });

      // Calculate this month's news
      const thisMonthNews = newsResponse.articles.filter((article: any) => {
        const articleDate = new Date(article.created_at);
        return articleDate.getMonth() === now.getMonth() &&
          articleDate.getFullYear() === now.getFullYear();
      });

      // Calculate news by category
      const categories: Record<string, number> = {};
      newsResponse.articles.forEach((article: any) => {
        categories[article.category] = (categories[article.category] || 0) + 1;
      });

      // Get recent activity (last 5 applications)
      const recentActivity = appsListResponse.applications
        .slice(0, 5)
        .map((app: any) => ({
          type: 'application',
          name: app.full_name,
          program: app.program,
          status: app.status,
          date: app.created_at,
        }));

      setStats({
        applications: {
          total: appsResponse.stats.total,
          pending: appsResponse.stats.pending,
          approved: appsResponse.stats.approved,
          rejected: appsResponse.stats.rejected,
          thisMonth: thisMonthApps.length,
        },
        news: {
          total: newsResponse.articles.length,
          thisMonth: thisMonthNews.length,
          categories,
        },
        teachers: {
          total: (teachersResponse.teachers || []).length,
          pending: pendingTeachers,
        },
        visitors: {
          monthly: analyticsData.monthly_visitors,
          total: analyticsData.total_visitors,
          trend: analyticsData.trend,
        },
        recentActivity,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch overview data',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <section className="p-6 space-y-6">
        {/* Header */}
        <div className="animate-fadeInDown">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Admin Overview</span>
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your school website.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-fadeInUp">
          {/* Total Applications */}
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applications.total}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.applications.thisMonth} this month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Applications */}
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <Activity className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applications.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Requires attention
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Approved Applications */}
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applications.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.applications.total > 0
                    ? Math.round((stats.applications.approved / stats.applications.total) * 100)
                    : 0}% approval rate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* News Articles */}
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Newspaper className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.news.total}</p>
                <p className="text-sm text-muted-foreground">News Articles</p>
                <p className="text-xs text-purple-600 mt-1">
                  +{stats.news.thisMonth} this month
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Monthly Visitors */}
          <Card className="hover-lift border-school-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <Eye className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stats.visitors.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stats.visitors.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stats.visitors.trend)}%
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.visitors.monthly}</p>
                <p className="text-sm text-muted-foreground">Monthly Visitors</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.visitors.total} total visits
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Registrations */}
          <Card className="hover-lift border-school-primary/20 bg-indigo-50/30 dark:bg-indigo-900/10">
            <CardContent className="p-6">
              <Link to="/admin/teachers" className="block space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <UserCheck2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  {stats.teachers.pending > 0 && (
                    <Badge className="bg-amber-500 text-white animate-pulse">
                      {stats.teachers.pending} Pending
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.teachers.total}</p>
                  <p className="text-sm text-muted-foreground">Registered Teachers</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    {stats.teachers.pending} awaiting approval
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Status Breakdown */}
          <Card className="animate-fadeInLeft">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-school-primary" />
                Application Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">
                    {stats.applications.pending}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Approved</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {stats.applications.approved}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Rejected</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {stats.applications.rejected}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* News by Category */}
          <Card className="animate-fadeInRight">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-school-primary" />
                News by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.news.categories).length > 0 ? (
                  Object.entries(stats.news.categories).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-background rounded-full h-2">
                          <div
                            className="bg-school-primary h-2 rounded-full"
                            style={{
                              width: `${(count / stats.news.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No news articles yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="animate-fadeInUp">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-school-primary" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background rounded-lg">
                        <Users className="w-5 h-5 text-school-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <GraduationCap className="w-3 h-3" />
                          {activity.program}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(activity.status)}
                        <span className="text-sm capitalize">{activity.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">This Month</p>
                  <p className="text-3xl font-bold">{stats.applications.thisMonth}</p>
                  <p className="text-sm opacity-90">New Applications</p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Approval Rate</p>
                  <p className="text-3xl font-bold">
                    {stats.applications.total > 0
                      ? Math.round((stats.applications.approved / stats.applications.total) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm opacity-90">Success Rate</p>
                </div>
                <CheckCircle className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Content</p>
                  <p className="text-3xl font-bold">{stats.news.total}</p>
                  <p className="text-sm opacity-90">Published Articles</p>
                </div>
                <Newspaper className="w-12 h-12 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AdminLayout>
  );
}
