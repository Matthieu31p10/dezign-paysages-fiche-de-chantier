import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  resource_accessed?: string;
  event_details: Record<string, any>;
  risk_score: number;
  geolocation?: Record<string, any>;
  session_id?: string;
  created_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

interface ActiveSession {
  id: string;
  user_id: string;
  session_token_hash: string;
  ip_address: string;
  user_agent?: string;
  geolocation?: Record<string, any>;
  login_time: string;
  last_activity: string;
  is_suspicious: boolean;
  mfa_verified: boolean;
  device_fingerprint?: string;
  expires_at: string;
}

interface DataAccessLog {
  id: string;
  user_id?: string;
  table_name: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  record_ids?: string[];
  query_hash?: string;
  success: boolean;
  error_message?: string;
  ip_address?: string;
  created_at: string;
  execution_time_ms?: number;
  row_count: number;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  suspiciousSessions: number;
  recentDataAccess: number;
  topRiskIPs: Array<{ ip: string; count: number; risk_score: number }>;
  eventsByType: Array<{ type: string; count: number }>;
}

export const useSecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [dataAccessLogs, setDataAccessLogs] = useState<DataAccessLog[]>([]);
  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    suspiciousSessions: 0,
    recentDataAccess: 0,
    topRiskIPs: [],
    eventsByType: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les événements de sécurité récents
  const loadSecurityEvents = useCallback(async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Mapping pour assurer la compatibilité des types
      const mappedEvents: SecurityEvent[] = (data || []).map(event => ({
        ...event,
        severity: event.severity as 'low' | 'medium' | 'high' | 'critical',
        ip_address: event.ip_address as string | undefined,
        event_details: event.event_details as Record<string, any>,
        geolocation: event.geolocation as Record<string, any> | undefined
      }));
      
      setSecurityEvents(mappedEvents);
    } catch (err: any) {
      console.error('Erreur lors du chargement des événements de sécurité:', err);
      setError(err.message);
    }
  }, []);

  // Charger les sessions actives
  const loadActiveSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .order('last_activity', { ascending: false });

      if (error) throw error;
      
      // Mapping pour assurer la compatibilité des types
      const mappedSessions: ActiveSession[] = (data || []).map(session => ({
        ...session,
        ip_address: session.ip_address as string,
        geolocation: session.geolocation as Record<string, any> | undefined
      }));
      
      setActiveSessions(mappedSessions);
    } catch (err: any) {
      console.error('Erreur lors du chargement des sessions actives:', err);
      setError(err.message);
    }
  }, []);

  // Charger les logs d'accès aux données
  const loadDataAccessLogs = useCallback(async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('data_access_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Mapping pour assurer la compatibilité des types
      const mappedLogs: DataAccessLog[] = (data || []).map(log => ({
        ...log,
        operation: log.operation as 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
        ip_address: log.ip_address as string | undefined
      }));
      
      setDataAccessLogs(mappedLogs);
    } catch (err: any) {
      console.error('Erreur lors du chargement des logs d\'accès:', err);
      setError(err.message);
    }
  }, []);

  // Calculer les statistiques de sécurité
  const calculateSecurityStats = useCallback(async () => {
    try {
      // Statistiques des événements
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_events')
        .select('event_type, severity, ip_address, risk_score')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (eventsError) throw eventsError;

      // Statistiques des sessions suspectes
      const { data: suspiciousData, error: suspiciousError } = await supabase
        .from('active_sessions')
        .select('id')
        .eq('is_suspicious', true);

      if (suspiciousError) throw suspiciousError;

      // Statistiques d'accès aux données récentes
      const { data: accessData, error: accessError } = await supabase
        .from('data_access_log')
        .select('id')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      if (accessError) throw accessError;

      // Traitement des statistiques
      const events = eventsData || [];
      const criticalEvents = events.filter(e => e.severity === 'critical').length;
      
      // Top IP par risque
      const ipRiskMap = new Map<string, { count: number; totalRisk: number }>();
      events.forEach(event => {
        const ipAddress = event.ip_address as string;
        if (ipAddress) {
          const current = ipRiskMap.get(ipAddress) || { count: 0, totalRisk: 0 };
          ipRiskMap.set(ipAddress, {
            count: current.count + 1,
            totalRisk: current.totalRisk + (event.risk_score || 0)
          });
        }
      });

      const topRiskIPs = Array.from(ipRiskMap.entries())
        .map(([ip, data]) => ({
          ip,
          count: data.count,
          risk_score: Math.round(data.totalRisk / data.count)
        }))
        .sort((a, b) => b.risk_score - a.risk_score)
        .slice(0, 10);

      // Événements par type
      const typeMap = new Map<string, number>();
      events.forEach(event => {
        typeMap.set(event.event_type, (typeMap.get(event.event_type) || 0) + 1);
      });

      const eventsByType = Array.from(typeMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      setSecurityStats({
        totalEvents: events.length,
        criticalEvents,
        suspiciousSessions: suspiciousData?.length || 0,
        recentDataAccess: accessData?.length || 0,
        topRiskIPs,
        eventsByType
      });
    } catch (err: any) {
      console.error('Erreur lors du calcul des statistiques:', err);
      setError(err.message);
    }
  }, []);

  // Enregistrer un événement de sécurité
  const logSecurityEvent = useCallback(async (
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, any> = {},
    userId?: string,
    userEmail?: string
  ) => {
    try {
      // Obtenir des informations sur la session
      const userAgent = navigator.userAgent;
      const sessionId = crypto.randomUUID();

      const { error } = await supabase
        .from('security_events')
        .insert({
          event_type: eventType,
          severity,
          user_id: userId,
          user_email: userEmail,
          user_agent: userAgent,
          event_details: details,
          session_id: sessionId,
          risk_score: severity === 'critical' ? 80 : severity === 'high' ? 60 : severity === 'medium' ? 30 : 10
        });

      if (error) throw error;

      // Recharger les données
      await loadSecurityEvents();
      await calculateSecurityStats();

      // Afficher une notification pour les événements critiques
      if (severity === 'critical') {
        toast.error(`Alerte de sécurité critique: ${eventType}`);
      }
    } catch (err: any) {
      console.error('Erreur lors de l\'enregistrement de l\'événement:', err);
      toast.error('Erreur lors de l\'enregistrement de l\'événement de sécurité');
    }
  }, [loadSecurityEvents, calculateSecurityStats]);

  // Résoudre un événement de sécurité
  const resolveSecurityEvent = useCallback(async (eventId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('security_events')
        .update({
          resolved_at: new Date().toISOString(),
          resolution_notes: notes
        })
        .eq('id', eventId);

      if (error) throw error;

      await loadSecurityEvents();
      toast.success('Événement de sécurité résolu');
    } catch (err: any) {
      console.error('Erreur lors de la résolution de l\'événement:', err);
      toast.error('Erreur lors de la résolution de l\'événement');
    }
  }, [loadSecurityEvents]);

  // Marquer une session comme suspecte
  const markSessionSuspicious = useCallback(async (sessionId: string, suspicious = true) => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .update({ is_suspicious: suspicious })
        .eq('id', sessionId);

      if (error) throw error;

      await loadActiveSessions();
      toast.success(`Session ${suspicious ? 'marquée comme suspecte' : 'réhabilitée'}`);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la session:', err);
      toast.error('Erreur lors de la mise à jour de la session');
    }
  }, [loadActiveSessions]);

  // Configuration de la surveillance en temps réel
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadSecurityEvents(),
          loadActiveSessions(),
          loadDataAccessLogs(),
          calculateSecurityStats()
        ]);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();

    // Surveillance en temps réel des événements de sécurité
    const securityEventsChannel = supabase
      .channel('security-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_events'
        },
        (payload) => {
          console.log('Nouvel événement de sécurité:', payload);
          loadSecurityEvents();
          calculateSecurityStats();
          
          // Notification pour les nouveaux événements critiques
          if (payload.eventType === 'INSERT' && payload.new?.severity === 'critical') {
            toast.error(`🚨 Alerte critique: ${payload.new.event_type}`);
          }
        }
      )
      .subscribe();

    // Surveillance des sessions actives
    const activeSessionsChannel = supabase
      .channel('active-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_sessions'
        },
        () => {
          loadActiveSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(securityEventsChannel);
      supabase.removeChannel(activeSessionsChannel);
    };
  }, [loadSecurityEvents, loadActiveSessions, loadDataAccessLogs, calculateSecurityStats]);

  return {
    securityEvents,
    activeSessions,
    dataAccessLogs,
    securityStats,
    loading,
    error,
    logSecurityEvent,
    resolveSecurityEvent,
    markSessionSuspicious,
    refreshData: () => {
      loadSecurityEvents();
      loadActiveSessions();
      loadDataAccessLogs();
      calculateSecurityStats();
    }
  };
};