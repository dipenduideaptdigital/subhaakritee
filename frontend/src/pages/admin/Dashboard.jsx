import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// APIs
import { dashboardApi } from '../../api/dashboard';
import { contactsApi } from '../../api/contacts';
import Can from '../../components/shared/Can';

// Components
import WelcomeHeader from '../../components/admin/dashboard/WelcomeHeader';
import StatCards from '../../components/admin/dashboard/StatCards';
import LeadChart from '../../components/admin/dashboard/LeadChart';
import RecentInquiries from '../../components/admin/dashboard/RecentInquiries';
import ActivityTimeline from '../../components/admin/dashboard/ActivityTimeline';
import QuickActions from '../../components/admin/dashboard/QuickActions';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      unreadInquiries: 0,
      newInquiriesToday: 0,
      publishedProjects: 0,
      publishedPages: 0,
      publishedBlogs: 0,
    },
    recentLeads: [],
    activities: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [metricsRes, leadsRes, activityRes] = await Promise.allSettled([
          dashboardApi.getMetrics(),
          contactsApi.getSubmissions({ limit: 4 }), 
          dashboardApi.getActivityStream()
        ]);

        setDashboardData({
          metrics: metricsRes.status === 'fulfilled' ? metricsRes.value.data : {},
          recentLeads: leadsRes.status === 'fulfilled' ? leadsRes.value.data : [],
          activities: activityRes.status === 'fulfilled' ? activityRes.value.data : []
        });

      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Aggregating telemetry data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-sans pb-10">
      <WelcomeHeader user={user} currentDate={currentDate} />
      
      <StatCards statsData={dashboardData.metrics} />
      
      <Can permission="contact.view">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col h-full">
            <LeadChart />
          </div>
          <div className="flex flex-col h-full">
            <RecentInquiries leads={dashboardData.recentLeads} />
          </div>
        </div>
      </Can>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col h-full">
          <ActivityTimeline activities={dashboardData.activities} />
        </div>
        
        <div className="flex flex-col h-full">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;