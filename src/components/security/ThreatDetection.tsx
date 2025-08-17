import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Target, 
  Ban,
  Eye,
  RefreshCw,
  TrendingUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Threat {
  id: string;
  type: 'brute_force' | 'sql_injection' | 'xss' | 'ddos' | 'unauthorized_access' | 'data_exfiltration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'mitigated' | 'resolved';
  timestamp: Date;
  source: {
    ip: string;
    country: string;
    userAgent?: string;
  };
  target: string;
  description: string;
  attempts: number;
  blocked: boolean;
  riskScore: number;
}

interface SecurityMetric {
  name: string;
  value: number;
  change: number;
  status: 'good' | 'warning' | 'danger';
}

const ThreatDetection = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date>(new Date());

  useEffect(() => {
    generateMockThreats();
    generateSecurityMetrics();
  }, []);

  const generateMockThreats = () => {
    const threatTypes: Threat['type'][] = [
      'brute_force', 'sql_injection', 'xss', 'ddos', 'unauthorized_access', 'data_exfiltration'
    ];
    
    const severities: Threat['severity'][] = ['low', 'medium', 'high', 'critical'];
    const statuses: Threat['status'][] = ['active', 'mitigated', 'resolved'];
    
    const sources = [
      { ip: '185.220.101.42', country: 'Russie' },
      { ip: '103.85.24.15', country: 'Chine' },
      { ip: '91.236.74.119', country: 'Ukraine' },
      { ip: '157.230.39.148', country: 'États-Unis' },
      { ip: '95.211.198.69', country: 'Pays-Bas' }
    ];

    const threatDescriptions = {
      brute_force: 'Tentatives répétées de connexion avec différents mots de passe',
      sql_injection: 'Tentative d\'injection SQL détectée dans les paramètres de requête',
      xss: 'Script malveillant détecté dans les données utilisateur',
      ddos: 'Trafic anormalement élevé depuis cette adresse IP',
      unauthorized_access: 'Tentative d\'accès à une ressource protégée',
      data_exfiltration: 'Transfert de données suspect détecté'
    };

    const mockThreats: Threat[] = Array.from({ length: 15 }, (_, i) => {
      const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      return {
        id: `threat-${i}`,
        type,
        severity,
        status,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
        source: {
          ...source,
          userAgent: Math.random() > 0.5 ? 'Mozilla/5.0 (X11; Linux x86_64)' : undefined
        },
        target: type === 'brute_force' ? '/login' : 
               type === 'sql_injection' ? '/api/projects' : 
               type === 'ddos' ? '/api/*' : 
               '/api/data',
        description: threatDescriptions[type],
        attempts: Math.floor(Math.random() * 100) + 1,
        blocked: Math.random() > 0.3,
        riskScore: Math.floor(Math.random() * 100) + 1
      };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setThreats(mockThreats);
  };

  const generateSecurityMetrics = () => {
    const metrics: SecurityMetric[] = [
      {
        name: 'Tentatives bloquées',
        value: 847,
        change: -12,
        status: 'good'
      },
      {
        name: 'Menaces actives',
        value: 23,
        change: +5,
        status: 'warning'
      },
      {
        name: 'Score de sécurité',
        value: 92,
        change: +3,
        status: 'good'
      },
      {
        name: 'IPs bloquées',
        value: 156,
        change: +18,
        status: 'warning'
      }
    ];

    setSecurityMetrics(metrics);
  };

  const runSecurityScan = async () => {
    setIsScanning(true);
    
    // Simuler un scan de sécurité
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Régénérer les données après le scan
    generateMockThreats();
    generateSecurityMetrics();
    setLastScan(new Date());
    setIsScanning(false);
  };

  const blockThreat = (threatId: string) => {
    setThreats(prev => 
      prev.map(threat => 
        threat.id === threatId 
          ? { ...threat, blocked: true, status: 'mitigated' as const }
          : threat
      )
    );
  };

  const resolveThreat = (threatId: string) => {
    setThreats(prev => 
      prev.map(threat => 
        threat.id === threatId 
          ? { ...threat, status: 'resolved' as const }
          : threat
      )
    );
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'brute_force': return Target;
      case 'sql_injection': return AlertTriangle;
      case 'xss': return AlertTriangle;
      case 'ddos': return TrendingUp;
      case 'unauthorized_access': return Ban;
      case 'data_exfiltration': return Eye;
      default: return AlertTriangle;
    }
  };

  const getThreatColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'mitigated': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'brute_force': return 'Force brute';
      case 'sql_injection': return 'Injection SQL';
      case 'xss': return 'XSS';
      case 'ddos': return 'DDoS';
      case 'unauthorized_access': return 'Accès non autorisé';
      case 'data_exfiltration': return 'Exfiltration de données';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'mitigated': return 'Atténué';
      case 'resolved': return 'Résolu';
      default: return status;
    }
  };

  const activeThreatCount = threats.filter(t => t.status === 'active').length;
  const criticalThreatCount = threats.filter(t => t.severity === 'critical' && t.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* En-tête avec scan */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Détection des menaces</h2>
          <p className="text-muted-foreground">
            Dernier scan: {format(lastScan, 'dd/MM/yyyy à HH:mm', { locale: fr })}
          </p>
        </div>
        <Button 
          onClick={runSecurityScan}
          disabled={isScanning}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scan en cours...' : 'Lancer un scan'}
        </Button>
      </div>

      {/* Métriques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-sm ${metric.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                  <div className={`p-2 rounded-lg ${
                    metric.status === 'good' ? 'bg-green-500/10' :
                    metric.status === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                  }`}>
                    <Shield className={`h-4 w-4 ${
                      metric.status === 'good' ? 'text-green-500' :
                      metric.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertes critiques */}
      {criticalThreatCount > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              {criticalThreatCount} menace(s) critique(s) détectée(s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Des menaces critiques nécessitent une attention immédiate. Veuillez examiner et traiter ces alertes.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Liste des menaces */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Menaces détectées ({threats.length})
          </CardTitle>
          <CardDescription>
            {activeThreatCount} menace(s) active(s) nécessitent votre attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {threats.map((threat) => {
                const ThreatIcon = getThreatIcon(threat.type);
                
                return (
                  <Card key={threat.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getThreatColor(threat.severity)}`}>
                          <ThreatIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{getTypeLabel(threat.type)}</h4>
                            <Badge className={getThreatColor(threat.severity)}>
                              {threat.severity.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(threat.status)}>
                              {getStatusLabel(threat.status)}
                            </Badge>
                            {threat.blocked && (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                Bloqué
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{threat.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                            <div>
                              <p className="font-medium">Source</p>
                              <p>{threat.source.ip}</p>
                              <p>{threat.source.country}</p>
                            </div>
                            <div>
                              <p className="font-medium">Cible</p>
                              <p className="font-mono">{threat.target}</p>
                              <p>{threat.attempts} tentative(s)</p>
                            </div>
                            <div>
                              <p className="font-medium">Détecté</p>
                              <p>{format(threat.timestamp, 'dd/MM/yyyy', { locale: fr })}</p>
                              <p>{format(threat.timestamp, 'HH:mm:ss', { locale: fr })}</p>
                            </div>
                          </div>

                          {/* Score de risque */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Score de risque</span>
                              <span>{threat.riskScore}/100</span>
                            </div>
                            <Progress 
                              value={threat.riskScore} 
                              className={`h-2 ${threat.riskScore > 80 ? '[&>div]:bg-red-500' : 
                                threat.riskScore > 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                            />
                          </div>
                        </div>
                        
                        {threat.status === 'active' && (
                          <div className="flex flex-col gap-2">
                            {!threat.blocked && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => blockThreat(threat.id)}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Bloquer
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveThreat(threat.id)}
                            >
                              Résoudre
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatDetection;