import { getAuthToken, getUserIdFromToken } from '@/utils/auth';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

interface WebSocketMessage {
  type: 'MESSAGE' | 'TYPING' | 'STATUS_UPDATE';
  payload: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((userId: string, isTyping: boolean) => void)[] = [];
  private statusUpdateHandlers: ((messageId: string, status: string) => void)[] = [];
  private connectionHandlers: ((isConnected: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnected = false;
  private typingTimeout: NodeJS.Timeout | null = null;
  private lastTypingState: boolean = false;

  constructor() {
    console.log('WebSocketService: Service initialized');
  }

  public connect() {
    console.log('WebSocketService: Attempting to connect...');
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocketService: Already connected, skipping connection');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error('WebSocketService: No authentication token found');
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('WebSocketService: Could not extract userId from token');
      return;
    }

    console.log('WebSocketService: Creating new WebSocket connection with auth protocols');
    // Create WebSocket with proper headers
    this.socket = new WebSocket(`ws://localhost:8085/ws?userId=${userId}&token=${token}`);

    // Set headers after connection is established
    this.socket.onopen = () => {
      console.log('WEBSOCKET CONNECTION ESTABLISHED SUCCESSFULLY!');
      console.log('WebSocketService: Connection established successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus(true);
    };

    this.socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocketService: Received message:', data);
        this.handleMessage(data);
      } catch (error) {
        console.error('WebSocketService: Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocketService: Connection closed with code:', event.code, 'reason:', event.reason);
      this.isConnected = false;
      this.notifyConnectionStatus(false);
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocketService: Connection error:', error);
      this.isConnected = false;
      this.notifyConnectionStatus(false);
    };
  }

  private notifyConnectionStatus(isConnected: boolean) {
    console.log('WebSocketService: Notifying connection status:', isConnected);
    this.connectionHandlers.forEach(handler => handler(isConnected));
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`WebSocketService: Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      this.reconnectTimeout = setTimeout(() => {
        console.log(`WebSocketService: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    } else {
      console.error('WebSocketService: Max reconnection attempts reached');
    }
  }

  private handleMessage(data: WebSocketMessage) {
    console.log('WebSocketService: Handling message of type:', data.type);
    if (data.type === 'MESSAGE') {
      this.messageHandlers.forEach(handler => handler(data.payload));
    } else if (data.type === 'TYPING') {
      this.typingHandlers.forEach(handler => handler(data.payload.userId, data.payload.isTyping));
    } else if (data.type === 'STATUS_UPDATE') {
      this.statusUpdateHandlers.forEach(handler => 
        handler(data.payload.messageId, data.payload.status)
      );
    }
  }

  /**
   * Send a chat message via WebSocket.
   * @param message ChatMessage object (id can be temporary, status optional)
   */
  public sendMessage(message: Partial<Message> & { receiverId: string; content: string }) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    // Clear any pending typing indicator
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    // Reset typing state
    this.lastTypingState = false;

    // Send the message
    const payload = {
      receiverId: message.receiverId,
      content: message.content
    };
    this.socket.send(JSON.stringify(payload));
  }

  public sendTypingIndicator(receiverId: string, isTyping: boolean) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    console.log('WebSocketService: Sending typing indicator to:', receiverId, isTyping);
    const message = {
      id: `temp-${Date.now()}`,
      senderId: getUserIdFromToken(),
      receiverId: receiverId,
      content: isTyping ? "TYPING" : "NOT_TYPING",
      timestamp: new Date().toISOString(),
      status: 'SENT',
      deliveredAt: null,
      readAt: null
    };

    this.socket.send(JSON.stringify(message));
  }

  public onMessage(handler: (message: Message) => void) {
    console.log('WebSocketService: Adding message handler');
    this.messageHandlers.push(handler);
    return () => {
      console.log('WebSocketService: Removing message handler');
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  public onTyping(handler: (userId: string, isTyping: boolean) => void) {
    console.log('WebSocketService: Adding typing handler');
    this.typingHandlers.push(handler);
    return () => {
      console.log('WebSocketService: Removing typing handler');
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  public onStatusUpdate(handler: (messageId: string, status: string) => void) {
    console.log('WebSocketService: Adding status update handler');
    this.statusUpdateHandlers.push(handler);
    return () => {
      console.log('WebSocketService: Removing status update handler');
      this.statusUpdateHandlers = this.statusUpdateHandlers.filter(h => h !== handler);
    };
  }

  public onConnectionChange(handler: (isConnected: boolean) => void) {
    console.log('WebSocketService: Adding connection change handler');
    this.connectionHandlers.push(handler);
    return () => {
      console.log('WebSocketService: Removing connection change handler');
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public disconnect() {
    console.log('WebSocketService: Disconnecting...');
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.socket) {
      this.socket.close();
    }
    this.isConnected = false;
    this.notifyConnectionStatus(false);
  }
}

export const websocketService = new WebSocketService(); 