import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Save,
  Key,
  Globe,
  Smartphone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@csam.edu",
    phone: "+255 123 456 789",
    role: "Administrator",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    newApplications: true,
    applicationApproved: false,
    applicationRejected: false,
  });

  // SMS Settings
  const [smsSettings, setSmsSettings] = useState({
    apiKey: "",
    apiSecret: "",
    senderId: "CSAM",
    enabled: true,
  });

  // Website Settings
  const [websiteSettings, setWebsiteSettings] = useState({
    schoolName: "Center for Skill Acquisition and Management",
    schoolEmail: "info@csam.edu",
    schoolPhone: "+255 123 456 789",
    schoolAddress: "Dar es Salaam, Tanzania",
    applicationDeadline: "",
    maintenanceMode: false,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Profile settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Notification settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSMS = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "SMS settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save SMS settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWebsite = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Website settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save website settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <section className="p-6 space-y-6">
        {/* Header */}
        <div className="animate-fadeInDown">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Admin Settings</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your admin account and system settings
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="animate-fadeInUp">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-school-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profileData.role}
                      disabled
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={loading} className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="animate-fadeInUp delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-school-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button variant="outline" className="w-full md:w-auto">
                  <Shield className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="animate-fadeInUp">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-school-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-medium">Event Notifications</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Applications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when students submit applications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newApplications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newApplications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Application Approved</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when applications are approved
                      </p>
                    </div>
                    <Switch
                      checked={notifications.applicationApproved}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, applicationApproved: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Application Rejected</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when applications are rejected
                      </p>
                    </div>
                    <Switch
                      checked={notifications.applicationRejected}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, applicationRejected: checked })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} disabled={loading} className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Settings */}
          <TabsContent value="sms" className="space-y-6">
            <Card className="animate-fadeInUp">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-school-primary" />
                  SMS Configuration
                </CardTitle>
                <CardDescription>
                  Configure SMS gateway for sending notifications to students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable SMS Service</Label>
                    <p className="text-sm text-muted-foreground">
                      Turn on/off SMS notifications
                    </p>
                  </div>
                  <Switch
                    checked={smsSettings.enabled}
                    onCheckedChange={(checked) =>
                      setSmsSettings({ ...smsSettings, enabled: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your SMS API key"
                    value={smsSettings.apiKey}
                    onChange={(e) => setSmsSettings({ ...smsSettings, apiKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    placeholder="Enter your SMS API secret"
                    value={smsSettings.apiSecret}
                    onChange={(e) => setSmsSettings({ ...smsSettings, apiSecret: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender-id">Sender ID</Label>
                  <Input
                    id="sender-id"
                    placeholder="e.g., CSAM"
                    value={smsSettings.senderId}
                    onChange={(e) => setSmsSettings({ ...smsSettings, senderId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will appear as the sender name in SMS messages
                  </p>
                </div>

                <Button onClick={handleSaveSMS} disabled={loading} className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save SMS Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Website Settings */}
          <TabsContent value="website" className="space-y-6">
            <Card className="animate-fadeInUp">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-school-primary" />
                  Website Configuration
                </CardTitle>
                <CardDescription>
                  Manage general website settings and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school-name">School Name</Label>
                  <Input
                    id="school-name"
                    value={websiteSettings.schoolName}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, schoolName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school-email">School Email</Label>
                    <Input
                      id="school-email"
                      type="email"
                      value={websiteSettings.schoolEmail}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, schoolEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-phone">School Phone</Label>
                    <Input
                      id="school-phone"
                      value={websiteSettings.schoolPhone}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, schoolPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school-address">School Address</Label>
                  <Textarea
                    id="school-address"
                    value={websiteSettings.schoolAddress}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, schoolAddress: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application-deadline">Application Deadline</Label>
                  <Input
                    id="application-deadline"
                    type="date"
                    value={websiteSettings.applicationDeadline}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, applicationDeadline: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="space-y-0.5">
                    <Label className="text-yellow-800 dark:text-yellow-200">Maintenance Mode</Label>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Enable to show maintenance page to visitors
                    </p>
                  </div>
                  <Switch
                    checked={websiteSettings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setWebsiteSettings({ ...websiteSettings, maintenanceMode: checked })
                    }
                  />
                </div>

                <Button onClick={handleSaveWebsite} disabled={loading} className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Website Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </AdminLayout>
  );
}
