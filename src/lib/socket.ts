import { Server } from 'socket.io';

interface User {
  id: string;
  name: string;
  role: 'CLIENT' | 'DESIGNER' | 'ADMIN';
  avatar?: string;
}

interface ProjectRoom {
  projectId: string;
  users: User[];
  activeTools: string[];
  cursorPositions: { [userId: string]: { x: number; y: number } };
  sharedState: {
    selectedElement?: string;
    zoomLevel: number;
    viewMode: string;
  };
}

interface CollaborationMessage {
  type: 'user_joined' | 'user_left' | 'cursor_move' | 'tool_select' | 'element_select' | 'view_change' | 'chat_message' | 'design_update';
  projectId: string;
  userId: string;
  data: any;
  timestamp: string;
}

const projectRooms: { [projectId: string]: ProjectRoom } = {};

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // User joins a project room
    socket.on('join_project', (data: { projectId: string; user: User }) => {
      const { projectId, user } = data;
      
      // Join room
      socket.join(`project_${projectId}`);
      
      // Initialize room if not exists
      if (!projectRooms[projectId]) {
        projectRooms[projectId] = {
          projectId,
          users: [],
          activeTools: [],
          cursorPositions: {},
          sharedState: {
            zoomLevel: 1,
            viewMode: '2d'
          }
        };
      }
      
      // Add user to room
      const room = projectRooms[projectId];
      if (!room.users.find(u => u.id === user.id)) {
        room.users.push(user);
      }
      
      // Notify others
      socket.to(`project_${projectId}`).emit('collaboration_message', {
        type: 'user_joined',
        projectId,
        userId: user.id,
        data: { user },
        timestamp: new Date().toISOString()
      } as CollaborationMessage);
      
      // Send current room state to new user
      socket.emit('room_state', {
        users: room.users,
        activeTools: room.activeTools,
        sharedState: room.sharedState,
        timestamp: new Date().toISOString()
      });
      
      console.log(`User ${user.name} joined project ${projectId}`);
    });
    
    // Handle cursor movement
    socket.on('cursor_move', (data: { projectId: string; x: number; y: number }) => {
      const { projectId, x, y } = data;
      const room = projectRooms[projectId];
      
      if (room) {
        room.cursorPositions[socket.id] = { x, y };
        
        // Broadcast to others in room
        socket.to(`project_${projectId}`).emit('collaboration_message', {
          type: 'cursor_move',
          projectId,
          userId: socket.id,
          data: { x, y },
          timestamp: new Date().toISOString()
        } as CollaborationMessage);
      }
    });
    
    // Handle tool selection
    socket.on('tool_select', (data: { projectId: string; tool: string }) => {
      const { projectId, tool } = data;
      const room = projectRooms[projectId];
      
      if (room) {
        if (!room.activeTools.includes(tool)) {
          room.activeTools.push(tool);
        }
        
        // Broadcast to others in room
        socket.to(`project_${projectId}`).emit('collaboration_message', {
          type: 'tool_select',
          projectId,
          userId: socket.id,
          data: { tool },
          timestamp: new Date().toISOString()
        } as CollaborationMessage);
      }
    });
    
    // Handle element selection
    socket.on('element_select', (data: { projectId: string; elementId: string }) => {
      const { projectId, elementId } = data;
      const room = projectRooms[projectId];
      
      if (room) {
        room.sharedState.selectedElement = elementId;
        
        // Broadcast to others in room
        socket.to(`project_${projectId}`).emit('collaboration_message', {
          type: 'element_select',
          projectId,
          userId: socket.id,
          data: { elementId },
          timestamp: new Date().toISOString()
        } as CollaborationMessage);
      }
    });
    
    // Handle view changes
    socket.on('view_change', (data: { projectId: string; zoomLevel: number; viewMode: string }) => {
      const { projectId, zoomLevel, viewMode } = data;
      const room = projectRooms[projectId];
      
      if (room) {
        room.sharedState.zoomLevel = zoomLevel;
        room.sharedState.viewMode = viewMode;
        
        // Broadcast to others in room
        socket.to(`project_${projectId}`).emit('collaboration_message', {
          type: 'view_change',
          projectId,
          userId: socket.id,
          data: { zoomLevel, viewMode },
          timestamp: new Date().toISOString()
        } as CollaborationMessage);
      }
    });
    
    // Handle chat messages
    socket.on('chat_message', (data: { projectId: string; message: string; user: User }) => {
      const { projectId, message, user } = data;
      
      // Broadcast to all in room including sender
      io.to(`project_${projectId}`).emit('collaboration_message', {
        type: 'chat_message',
        projectId,
        userId: user.id,
        data: { message, user },
        timestamp: new Date().toISOString()
      } as CollaborationMessage);
    });
    
    // Handle design updates
    socket.on('design_update', (data: { projectId: string; updateType: string; updateData: any }) => {
      const { projectId, updateType, updateData } = data;
      
      // Broadcast to others in room
      socket.to(`project_${projectId}`).emit('collaboration_message', {
        type: 'design_update',
        projectId,
        userId: socket.id,
        data: { updateType, updateData },
        timestamp: new Date().toISOString()
      } as CollaborationMessage);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Find and remove user from all rooms
      Object.keys(projectRooms).forEach(projectId => {
        const room = projectRooms[projectId];
        const userIndex = room.users.findIndex(u => u.id === socket.id);
        
        if (userIndex !== -1) {
          const user = room.users[userIndex];
          room.users.splice(userIndex, 1);
          
          // Clean up cursor position
          delete room.cursorPositions[socket.id];
          
          // Notify others
          socket.to(`project_${projectId}`).emit('collaboration_message', {
            type: 'user_left',
            projectId,
            userId: socket.id,
            data: { user },
            timestamp: new Date().toISOString()
          } as CollaborationMessage);
          
          // Remove room if empty
          if (room.users.length === 0) {
            delete projectRooms[projectId];
          }
        }
      });
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to AI Interior Designer Collaboration!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};