'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface User {
  id: string
  name: string
  role: 'CLIENT' | 'DESIGNER' | 'ADMIN'
  avatar?: string
}

interface CollaborationMessage {
  type: 'user_joined' | 'user_left' | 'cursor_move' | 'tool_select' | 'element_select' | 'view_change' | 'chat_message' | 'design_update'
  projectId: string
  userId: string
  data: any
  timestamp: string
}

interface RoomState {
  users: User[]
  activeTools: string[]
  sharedState: {
    selectedElement?: string
    zoomLevel: number
    viewMode: string
  }
}

interface UseCollaborationReturn {
  isConnected: boolean
  users: User[]
  activeTools: string[]
  sharedState: RoomState['sharedState']
  cursorPositions: { [userId: string]: { x: number; y: number } }
  messages: CollaborationMessage[]
  joinProject: (projectId: string, user: User) => void
  leaveProject: (projectId: string) => void
  sendCursorMove: (projectId: string, x: number, y: number) => void
  sendToolSelect: (projectId: string, tool: string) => void
  sendElementSelect: (projectId: string, elementId: string) => void
  sendViewChange: (projectId: string, zoomLevel: number, viewMode: string) => void
  sendChatMessage: (projectId: string, message: string, user: User) => void
  sendDesignUpdate: (projectId: string, updateType: string, updateData: any) => void
}

export function useCollaboration(): UseCollaborationReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [activeTools, setActiveTools] = useState<string[]>([])
  const [sharedState, setSharedState] = useState<RoomState['sharedState']>({
    zoomLevel: 1,
    viewMode: '2d'
  })
  const [cursorPositions, setCursorPositions] = useState<{ [userId: string]: { x: number; y: number } }>({})
  const [messages, setMessages] = useState<CollaborationMessage[]>([])
  
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000', {
      path: '/api/socketio'
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to collaboration server')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from collaboration server')
    })

    socket.on('room_state', (data: RoomState) => {
      setUsers(data.users)
      setActiveTools(data.activeTools)
      setSharedState(data.sharedState)
    })

    socket.on('collaboration_message', (message: CollaborationMessage) => {
      setMessages(prev => [...prev, message])
      
      // Handle different message types
      switch (message.type) {
        case 'user_joined':
          setUsers(prev => [...prev, message.data.user])
          break
        case 'user_left':
          setUsers(prev => prev.filter(u => u.id !== message.data.user.id))
          break
        case 'cursor_move':
          setCursorPositions(prev => ({
            ...prev,
            [message.userId]: { x: message.data.x, y: message.data.y }
          }))
          break
        case 'tool_select':
          if (!activeTools.includes(message.data.tool)) {
            setActiveTools(prev => [...prev, message.data.tool])
          }
          break
        case 'element_select':
          setSharedState(prev => ({
            ...prev,
            selectedElement: message.data.elementId
          }))
          break
        case 'view_change':
          setSharedState(prev => ({
            ...prev,
            zoomLevel: message.data.zoomLevel,
            viewMode: message.data.viewMode
          }))
          break
      }
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const joinProject = (projectId: string, user: User) => {
    if (socketRef.current) {
      socketRef.current.emit('join_project', { projectId, user })
    }
  }

  const leaveProject = (projectId: string) => {
    if (socketRef.current) {
      socketRef.current.leave(`project_${projectId}`)
    }
  }

  const sendCursorMove = (projectId: string, x: number, y: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('cursor_move', { projectId, x, y })
    }
  }

  const sendToolSelect = (projectId: string, tool: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('tool_select', { projectId, tool })
    }
  }

  const sendElementSelect = (projectId: string, elementId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('element_select', { projectId, elementId })
    }
  }

  const sendViewChange = (projectId: string, zoomLevel: number, viewMode: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('view_change', { projectId, zoomLevel, viewMode })
    }
  }

  const sendChatMessage = (projectId: string, message: string, user: User) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('chat_message', { projectId, message, user })
    }
  }

  const sendDesignUpdate = (projectId: string, updateType: string, updateData: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('design_update', { projectId, updateType, updateData })
    }
  }

  return {
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
    sendChatMessage,
    sendDesignUpdate
  }
}