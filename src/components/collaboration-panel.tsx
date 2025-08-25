'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCollaboration } from '@/hooks/use-collaboration'
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Eye, 
  MousePointer, 
  Tool,
  Send,
  Minimize2,
  Maximize2,
  UserPlus,
  UserMinus
} from 'lucide-react'

interface CollaborationPanelProps {
  projectId: string
  currentUser: {
    id: string
    name: string
    role: 'CLIENT' | 'DESIGNER' | 'ADMIN'
    avatar?: string
  }
}

interface ChatMessage {
  id: string
  user: {
    id: string
    name: string
    role: 'CLIENT' | 'DESIGNER' | 'ADMIN'
    avatar?: string
  }
  message: string
  timestamp: string
}

export function CollaborationPanel({ projectId, currentUser }: CollaborationPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  
  const {
    isConnected,
    users,
    activeTools,
    sharedState,
    cursorPositions,
    messages,
    joinProject,
    leaveProject,
    sendCursorMove,
    sendToolSelect,
    sendElementSelect,
    sendViewChange,
    sendChatMessage: sendSocketChatMessage,
    sendDesignUpdate
  } = useCollaboration()

  useEffect(() => {
    if (isOpen && projectId) {
      joinProject(projectId, currentUser)
    } else {
      leaveProject(projectId)
    }
  }, [isOpen, projectId, currentUser, joinProject, leaveProject])

  useEffect(() => {
    // Convert socket messages to chat messages
    const chatMsgs = messages
      .filter(msg => msg.type === 'chat_message')
      .map(msg => ({
        id: `${msg.userId}-${msg.timestamp}`,
        user: msg.data.user,
        message: msg.data.message,
        timestamp: msg.timestamp
      }))
    setChatMessages(chatMsgs)
  }, [messages])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      sendSocketChatMessage(projectId, chatMessage, currentUser)
      setChatMessage('')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CLIENT': return 'bg-blue-100 text-blue-800'
      case 'DESIGNER': return 'bg-green-100 text-green-800'
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        size="lg"
      >
        <Users className="w-4 h-4 mr-2" />
        Collaboration ({users.length})
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 shadow-xl border rounded-lg bg-background">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <CardTitle className="text-lg">Collaboration</CardTitle>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {users.length} user{users.length !== 1 ? 's' : ''} collaborating
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="users" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Users
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">
                <MessageSquare className="w-3 h-3 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Tool className="w-3 h-3 mr-1" />
                Tools
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="p-4">
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </Badge>
                      </div>
                      {cursorPositions[user.id] && (
                        <div className="text-xs text-muted-foreground">
                          <MousePointer className="w-3 h-3 inline mr-1" />
                          {Math.round(cursorPositions[user.id].x)}, {Math.round(cursorPositions[user.id].y)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="chat" className="p-4">
              <div className="flex flex-col h-48">
                <ScrollArea className="flex-1 mb-3">
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={msg.user.avatar} />
                          <AvatarFallback className="text-xs">
                            {msg.user.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{msg.user.name}</p>
                            <Badge className={`text-xs ${getRoleColor(msg.user.role)}`}>
                              {msg.user.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="p-4">
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Active Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeTools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                      {activeTools.length === 0 && (
                        <p className="text-xs text-muted-foreground">No active tools</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Shared State</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Zoom Level:</span>
                        <span>{sharedState.zoomLevel}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>View Mode:</span>
                        <span>{sharedState.viewMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Selected:</span>
                        <span>{sharedState.selectedElement || 'None'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendViewChange(projectId, 1, '2d')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        2D View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendViewChange(projectId, 1, '3d')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        3D View
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}