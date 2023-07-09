import { WebSocketServer, WebSocket } from 'ws';
import GameController from '../game/game';

const gameController = new GameController();

export default function createSocket(port: number): void {
	const ws: WebSocketServer = new WebSocketServer({ port: port, clientTracking: true });

	gameController.setWebSocketServer(ws);

	console.log(`Websocket opened on ws://localhost:${port}\n\n`);

	ws.on('connection', (socket: WebSocket) => {
		gameController.setSocket(socket);
	})

	ws.on('close', () => 'WebSocket server was closed');
}
