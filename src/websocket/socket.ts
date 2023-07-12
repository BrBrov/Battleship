import { WebSocketServer, WebSocket } from 'ws';
import GameController from '../game/game';

const gameController = new GameController();

export default function createSocket(port: number): void {
	const ws: WebSocketServer = new WebSocketServer({ port: port, clientTracking: true });

	console.log(`\x1B[38;2;14;200;180mWebsocket opened on ws://localhost:${port}\n\n\x1B[0m`);

	ws.on('connection', (socket: WebSocket) => {
		gameController.setSocket(socket);
	})

	ws.on('close', () => '\x1B[38;2;245;10;10mWebSocket server was closed\x1B[0m');
}
