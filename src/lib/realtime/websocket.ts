import { Server as WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';
import { logger } from '../monitoring/logger';
import { Redis } from 'ioredis';

const pubClient = new Redis(process.env.REDIS_URL);
const subClient = new Redis(process.env.REDIS_URL);

export class RealtimeService {
  private wss: WebSocketServer;
  private clients: Map<string, Set<WebSocket>>;

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();

    this.setupWebSocket();
    this.setupRedisSubscriber();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      const projectId = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('projectId');
      
      if (projectId) {
        if (!this.clients.has(projectId)) {
          this.clients.set(projectId, new Set());
        }
        this.clients.get(projectId)!.add(ws);

        ws.on('close', () => {
          this.clients.get(projectId)?.delete(ws);
        });
      }
    });
  }

  private setupRedisSubscriber() {
    subClient.subscribe('project-events');
    subClient.on('message', (channel, message) => {
      const event = JSON.parse(message);
      this.broadcastToProject(event.projectId, event);
    });
  }

  private broadcastToProject(projectId: string, data: any) {
    const projectClients = this.clients.get(projectId);
    if (projectClients) {
      projectClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  }

  static async publishEvent(projectId: string, eventType: string, data: any) {
    await pubClient.publish('project-events', JSON.stringify({
      projectId,
      type: eventType,
      data,
      timestamp: new Date()
    }));
  }
} 