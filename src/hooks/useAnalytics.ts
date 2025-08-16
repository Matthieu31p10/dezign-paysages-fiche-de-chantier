import { useState, useEffect } from 'react';

export interface AnalyticsData {
  pageViews: { date: string; views: number }[];
  userSessions: { date: string; sessions: number }[];
  conversionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: { page: string; views: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  timeOnSite: { time: string; users: number }[];
}

export function useAnalytics(dateRange: string = '7d') {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Simulate API call - in real app, this would be your analytics endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data based on date range
        const mockData: AnalyticsData = generateMockData(dateRange);
        
        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  return { data, loading, error };
}

function generateMockData(dateRange: string): AnalyticsData {
  const days = dateRange === '30d' ? 30 : dateRange === '7d' ? 7 : 1;
  const pageViews = [];
  const userSessions = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    pageViews.push({
      date: dateStr,
      views: Math.floor(Math.random() * 500) + 100
    });
    
    userSessions.push({
      date: dateStr,
      sessions: Math.floor(Math.random() * 200) + 50
    });
  }

  return {
    pageViews,
    userSessions,
    conversionRate: 12.5 + Math.random() * 5,
    averageSessionDuration: 180 + Math.random() * 120,
    bounceRate: 35 + Math.random() * 15,
    topPages: [
      { page: '/dashboard', views: 1250 },
      { page: '/fiches', views: 980 },
      { page: '/passages', views: 750 },
      { page: '/projects', views: 620 },
      { page: '/settings', views: 340 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 45 },
      { device: 'Mobile', percentage: 35 },
      { device: 'Tablet', percentage: 20 }
    ],
    timeOnSite: [
      { time: '0-30s', users: 150 },
      { time: '30s-1m', users: 280 },
      { time: '1-3m', users: 450 },
      { time: '3-5m', users: 320 },
      { time: '5m+', users: 200 }
    ]
  };
}