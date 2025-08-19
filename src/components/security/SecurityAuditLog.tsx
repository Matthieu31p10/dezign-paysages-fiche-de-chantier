import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, 
  Shield, 
  User, 
  Settings, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuditEvent {
  id: string;
  timestamp: Date;
  event: string;
  category: 'auth' | 'permission' | 'data' | 'system' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  details: string;
  ip: string;
  userAgent: string;
  success: boolean;
  metadata?: Record<string, any>;
}

const SecurityAuditLog = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Générer des événements d'audit factices
    const generateMockEvents = (): AuditEvent[] => {
      const categories: AuditEvent['category'][] = ['auth', 'permission', 'data', 'system', 'security'];
      const severities: AuditEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
      const users = [
        { id: '1', name: 'Jean Dupont', email: 'jean@example.com', role: 'admin' },
        { id: '2', name: 'Marie Martin', email: 'marie@example.com', role: 'manager' },
        { id: '3', name: 'Pierre Durand', email: 'pierre@example.com', role: 'user' }
      ];

      const eventTemplates = [
        { event: 'Connexion utilisateur', category: 'auth', details: 'Connexion réussie' },
        { event: 'Échec de connexion', category: 'auth', details: 'Mot de passe incorrect' },
        { event: 'Modification des permissions', category: 'permission', details: 'Permissions utilisateur modifiées' },
        { event: 'Création de projet', category: 'data', details: 'Nouveau projet créé' },
        { event: 'Suppression de données', category: 'data', details: 'Fiche de suivi supprimée' },
        { event: 'Tentative d\'accès non autorisé', category: 'security', details: 'Accès refusé à une ressource protégée' },
        { event: 'Modification des paramètres', category: 'system', details: 'Configuration système modifiée' },
        { event: 'Exportation de données', category: 'data', details: 'Rapport exporté en PDF' },
        { event: 'Déconnexion', category: 'auth', details: 'Utilisateur déconnecté' },
        { event: 'Tentative de force brute', category: 'security', details: 'Multiples tentatives de connexion détectées' }
      ];

      return Array.from({ length: 50 }, (_, i) => {
        const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const success = template.category === 'security' ? Math.random() > 0.5 : Math.random() > 0.2;
        
        return {
          id: `event-${i}`,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
          event: template.event,
          category: template.category as AuditEvent['category'],
          severity,
          user,
          details: template.details,
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          success,
          metadata: {
            resource: template.category === 'data' ? 'projects' : undefined,
            action: template.category === 'permission' ? 'update' : undefined
          }
        };
      }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    const mockEvents = generateMockEvents();
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    // Filtre par sévérité
    if (severityFilter !== 'all') {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => 
        statusFilter === 'success' ? event.success : !event.success
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, categoryFilter, severityFilter, statusFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return User;
      case 'permission': return Shield;
      case 'data': return Eye;
      case 'system': return Settings;
      case 'security': return AlertTriangle;
      default: return Eye;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'permission': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'data': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'system': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'security': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const exportLogs = () => {
    const csvData = filteredEvents.map(event => ({
      timestamp: format(event.timestamp, 'dd/MM/yyyy HH:mm:ss'),
      event: event.event,
      category: event.category,
      severity: event.severity,
      user: event.user.name,
      email: event.user.email,
      role: event.user.role,
      details: event.details,
      ip: event.ip,
      success: event.success ? 'Oui' : 'Non'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Journal d'audit de sécurité
            </CardTitle>
            <CardDescription>
              Surveillez toutes les activités et événements de sécurité
            </CardDescription>
          </div>
          <Button onClick={exportLogs} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les événements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="auth">Authentification</SelectItem>
                <SelectItem value="permission">Permissions</SelectItem>
                <SelectItem value="data">Données</SelectItem>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="security">Sécurité</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="failure">Échec</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{filteredEvents.length}</p>
                  <p className="text-sm text-muted-foreground">Événements</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {filteredEvents.filter(e => e.success).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Succès</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {filteredEvents.filter(e => !e.success).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Échecs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {filteredEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Critiques</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des événements */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const CategoryIcon = getCategoryIcon(event.category);
                const StatusIcon = event.success ? CheckCircle : XCircle;
                
                return (
                  <Card key={event.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getCategoryColor(event.category)}`}>
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{event.event}</h4>
                            <StatusIcon className={`h-4 w-4 ${event.success ? 'text-green-500' : 'text-red-500'}`} />
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{event.details}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {event.user.name} ({event.user.role})
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(event.timestamp, 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.ip}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;