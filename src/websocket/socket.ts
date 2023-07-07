import { WebSocketServer, WebSocket, RawData } from 'ws';
import generalHandler from './handlers/general-handler';

export default function createSocket(port: number): void {
	const ws: WebSocketServer = new WebSocketServer({ port: port });

	console.log(`Websocket opened on ws://localhost:${port}`);

	ws.on('connection', (socket: WebSocket) => {		

		socket.on('message', (data: RawData) => {

			const dataInString: string = data.toString();

			generalHandler(dataInString, socket);			
		});

		socket.on('close', () => socket.close());

		process.on('SIGINT', () => socket.close());
		
	})

	ws.on('close', () => ws.close());
}
