import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Bell, BellRing, Check, X, Settings, 
  AlertTriangle, Info, CheckCircle, Clock,
  User, Calendar, FileText, Trash2, Eye,
  Filter, MoreHorizontal, Star
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'project' | 'user' | 'reminder';
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'destructive';
  onClick: () => void;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  sound: boolean;
  categories: Record<string, boolean>;
  priorities: Record<string, boolean>;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onNotificationRead?: (id: string) => void;
  onNotificationDelete?: (id: string) => void;
  onSettingsChange?: (settings: NotificationSettings) => void;
  className?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouveau projet assigné',
    message: 'Le projet "Maintenance Villa Dubois" vous a été assigné pour demain.',
    type: 'info',
    priority: 'high',
    category: 'project',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actions: [
      { id: 'view', label: 'Voir', type: 'primary', onClick: () => {} },
      { id: 'accept', label: 'Accepter', type: 'secondary', onClick: () => {} }
    ]
  },
  {
    id: '2',
    title: 'Rapport hebdomadaire disponible',
    message: 'Le rapport de performance de la semaine est maintenant disponible.',
    type: 'success',
    priority: 'medium',
    category: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    id: '3',
    title: 'Maintenance requise',
    message: 'L\'équipement #A123 nécessite une maintenance préventive.',
    type: 'warning',
    priority: 'urgent',
    category: 'reminder',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    actions: [
      { id: 'schedule', label: 'Planifier', type: 'primary', onClick: () => {} }
    ]
  },
  {
    id: '4',
    title: 'Nouveau membre d\'équipe',
    message: 'Marie Dupont a rejoint l\'équipe Maintenance Nord.',
    type: 'info',
    priority: 'low',
    category: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  },
  {
    id: '5',
    title: 'Erreur de synchronisation',
    message: 'Échec de la synchronisation des données. Veuillez réessayer.',
    type: 'error',
    priority: 'high',
    category: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: false,
    actions: [
      { id: 'retry', label: 'Réessayer', type: 'primary', onClick: () => {} },
      { id: 'contact', label: 'Contacter support', type: 'secondary', onClick: () => {} }
    ]
  }
];

const defaultSettings: NotificationSettings = {
  email: true,
  push: true,
  desktop: false,
  sound: true,
  categories: {
    system: true,
    project: true,
    user: true,
    reminder: true
  },
  priorities: {
    low: true,
    medium: true,
    high: true,
    urgent: true
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = mockNotifications,
  onNotificationRead,
  onNotificationDelete,
  onSettingsChange,
  className = ""
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'important' && notification.priority !== 'urgent' && notification.priority !== 'high') return false;
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) return false;
    return true;
  });

  const getTypeIcon = (type: Notification['type'], priority: Notification['priority']) => {
    const iconClass = priority === 'urgent' ? 'h-4 w-4 animate-pulse' : 'h-4 w-4';
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-success`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-warning`} />;
      case 'error':
        return <X className={`${iconClass} text-destructive`} />;
      default:
        return <Info className={`${iconClass} text-info`} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'project': return <FileText className="h-3 w-3" />;
      case 'user': return <User className="h-3 w-3" />;
      case 'reminder': return <Clock className="h-3 w-3" />;
      default: return <Settings className="h-3 w-3" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    onNotificationRead?.(id);
  };

  const handleDelete = (id: string) => {
    onNotificationDelete?.(id);
  };

  const handleMarkAllAsRead = () => {
    notifications.filter(n => !n.read).forEach(n => handleMarkAsRead(n.id));
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => (
    <div className={`p-4 border-b border-border ${!notification.read ? 'bg-muted/30' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {getTypeIcon(notification.type, notification.priority)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                {notification.priority}
              </Badge>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {getCategoryIcon(notification.category)}
                <span className="capitalize">{notification.category}</span>
              </div>
              <span>
                {formatDistanceToNow(notification.timestamp, { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {notification.actions?.map((action) => (
                <Button
                  key={action.id}
                  variant={action.type === 'primary' ? 'default' : 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className="text-xs h-6"
                >
                  {action.label}
                </Button>
              ))}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40" align="end">
                  <div className="space-y-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3 mr-2" />
                        Marquer lu
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Méthodes de notification</h4>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email' },
            { key: 'push', label: 'Notifications push' },
            { key: 'desktop', label: 'Notifications bureau' },
            { key: 'sound', label: 'Son' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <Label htmlFor={item.key}>{item.label}</Label>
              <Switch
                id={item.key}
                checked={settings[item.key as keyof NotificationSettings] as boolean}
                onCheckedChange={(checked) => handleSettingChange(item.key as keyof NotificationSettings, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Catégories</h4>
        <div className="space-y-3">
          {[
            { key: 'system', label: 'Système' },
            { key: 'project', label: 'Projets' },
            { key: 'user', label: 'Utilisateurs' },
            { key: 'reminder', label: 'Rappels' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <Label htmlFor={`cat-${item.key}`}>{item.label}</Label>
              <Switch
                id={`cat-${item.key}`}
                checked={settings.categories[item.key]}
                onCheckedChange={(checked) => 
                  handleSettingChange('categories', { ...settings.categories, [item.key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Priorités</h4>
        <div className="space-y-3">
          {[
            { key: 'urgent', label: 'Urgent' },
            { key: 'high', label: 'Élevée' },
            { key: 'medium', label: 'Moyenne' },
            { key: 'low', label: 'Faible' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <Label htmlFor={`pri-${item.key}`}>{item.label}</Label>
              <Switch
                id={`pri-${item.key}`}
                checked={settings.priorities[item.key]}
                onCheckedChange={(checked) => 
                  handleSettingChange('priorities', { ...settings.priorities, [item.key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
            {urgentCount > 0 && (
              <Badge variant="default" className="text-xs animate-pulse">
                {urgentCount} urgent{urgentCount > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Tout marquer lu
              </Button>
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <SettingsPanel />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Toutes ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Non lues ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="important">
                Importantes ({notifications.filter(n => ['urgent', 'high'].includes(n.priority)).length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-96">
            <TabsContent value={filter} className="m-0">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune notification {filter !== 'all' ? filter === 'unread' ? 'non lue' : 'importante' : ''}</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};