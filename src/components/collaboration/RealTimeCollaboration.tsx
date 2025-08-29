import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, Users, Video, Share2, Bell,
  Send, Phone, Calendar, File, Image,
  Plus, Search, Settings, Minimize2, Maximize2,
  Clock, Check, CheckCheck, Pin, Star
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  edited?: boolean;
  reactions: Array<{
    emoji: string;
    users: string[];
  }>;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'direct';
  members: string[];
  unreadCount: number;
  lastMessage?: Message;
  isPinned: boolean;
}

interface ActiveSession {
  id: string;
  type: 'document' | 'project' | 'meeting';
  title: string;
  participants: User[];
  startTime: Date;
  isRecording?: boolean;
}

const RealTimeCollaboration: React.FC = () => {
  const [currentUser] = useState<User>({
    id: '1',
    name: 'Vous',
    email: 'you@company.com',
    status: 'online'
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Vous',
      email: 'you@company.com',
      status: 'online'
    },
    {
      id: '2',
      name: 'Marie Dubois',
      email: 'marie@company.com',
      status: 'online'
    },
    {
      id: '3',
      name: 'Jean Martin',
      email: 'jean@company.com',
      status: 'away',
      lastSeen: new Date(Date.now() - 300000)
    },
    {
      id: '4',
      name: 'Sophie Laurent',
      email: 'sophie@company.com',
      status: 'busy'
    },
    {
      id: '5',
      name: 'Paul Durand',
      email: 'paul@company.com',
      status: 'offline',
      lastSeen: new Date(Date.now() - 3600000)
    }
  ]);

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'Général',
      description: 'Discussions générales de l\'équipe',
      type: 'public',
      members: ['1', '2', '3', '4', '5'],
      unreadCount: 3,
      isPinned: true
    },
    {
      id: '2',
      name: 'Projets',
      description: 'Coordination des projets en cours',
      type: 'public',
      members: ['1', '2', '3', '4'],
      unreadCount: 7,
      isPinned: true
    },
    {
      id: '3',
      name: 'Marie Dubois',
      description: 'Discussion privée',
      type: 'direct',
      members: ['1', '2'],
      unreadCount: 1,
      isPinned: false
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '2',
      content: 'Bonjour tout le monde ! J\'ai terminé le projet Alpha, quelqu\'un peut-il le réviser ?',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      reactions: [
        { emoji: '👍', users: ['1', '3'] },
        { emoji: '🎉', users: ['4'] }
      ]
    },
    {
      id: '2',
      userId: '3',
      content: 'Parfait ! Je vais le checker dans l\'après-midi.',
      timestamp: new Date(Date.now() - 3300000),
      type: 'text',
      reactions: []
    },
    {
      id: '3',
      userId: '1',
      content: 'Excellent travail Marie ! 🚀',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      reactions: [
        { emoji: '❤️', users: ['2'] }
      ]
    }
  ]);

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      type: 'meeting',
      title: 'Réunion d\'équipe hebdomadaire',
      participants: users.filter(u => ['2', '3', '4'].includes(u.id)),
      startTime: new Date(Date.now() - 1800000),
      isRecording: true
    },
    {
      id: '2',
      type: 'document',
      title: 'Rapport mensuel - Edition collaborative',
      participants: users.filter(u => ['2', '5'].includes(u.id)),
      startTime: new Date(Date.now() - 900000)
    }
  ]);

  const [selectedChannel, setSelectedChannel] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Utilisateur inconnu';
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      reactions: []
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update channel unread count for others
    setChannels(prev => 
      prev.map(channel => 
        channel.id === selectedChannel 
          ? { ...channel, lastMessage: message }
          : channel
      )
    );

    toast.success('Message envoyé');
  };

  const handleJoinSession = (sessionId: string) => {
    toast.success('Vous avez rejoint la session');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastSeen = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'il y a moins d\'une minute';
    if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Sessions Banner */}
      {activeSessions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Video className="h-5 w-5 text-blue-600" />
                <span>Sessions Actives</span>
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-700">
                {activeSessions.length} en cours
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {session.type === 'meeting' ? <Video className="h-4 w-4 text-blue-600" /> :
                       session.type === 'document' ? <File className="h-4 w-4 text-blue-600" /> :
                       <Share2 className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Depuis {formatTime(session.startTime)}</span>
                        <span>•</span>
                        <span>{session.participants.length} participant(s)</span>
                        {session.isRecording && (
                          <>
                            <span>•</span>
                            <Badge variant="destructive" className="text-xs">
                              ● REC
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleJoinSession(session.id)}>
                    Rejoindre
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Sidebar - Channels & Users */}
        <div className="lg:col-span-1 space-y-4">
          {/* Online Users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Équipe en ligne</span>
                <Badge variant="secondary">
                  {users.filter(u => u.status === 'online').length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <div className="relative">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        {user.status === 'offline' && user.lastSeen && (
                          <p className="text-xs text-muted-foreground">
                            {formatLastSeen(user.lastSeen)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Channels */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Canaux</span>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedChannel === channel.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedChannel(channel.id)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {channel.isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                      <span className="text-sm font-medium">
                        {channel.type === 'direct' ? '@ ' : '# '}
                        {channel.name}
                      </span>
                    </div>
                    {channel.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span># {channels.find(c => c.id === selectedChannel)?.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {channels.find(c => c.id === selectedChannel)?.members.length} membre(s)
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Appel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Vidéo
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getUserName(message.userId).split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {getUserName(message.userId)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.edited && (
                            <Badge variant="outline" className="text-xs">
                              modifié
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Reactions */}
                        {message.reactions.length > 0 && (
                          <div className="flex space-x-1 mt-2">
                            {message.reactions.map((reaction, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                              >
                                {reaction.emoji} {reaction.users.length}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <File className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCollaboration;