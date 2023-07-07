import { WebSocketServer, Server, WebSocket, RawData } from "ws";
import generalHandler from "./handlers/general-handler";

export default function createSocket(port: number): void {
	const ws: Server = new WebSocketServer({ port: port });

	ws.on('connection', (socket: WebSocket) => {

		console.log(`Websocket opened on ws://localhost:${port}`);

		socket.on('message', (data: RawData) => {

			const dataInString: string = data.toString();

			generalHandler(dataInString, socket);			
		});

		socket.on('close', () => socket.close());
	})

	ws.on('close', () => ws.close());
}
