import { WebSocketServer, Server, WebSocket, RawData } from "ws";

export default function createSocket(): void {
	const ws: Server = new WebSocketServer({ port: 3000 });

	ws.on('connection', (socket: WebSocket) => {

		socket.on('message', (data: RawData) => {

			const dataInString: string = data.toString();
			console.dir(data.toString());
			
			socket.send(dataInString);
		});

		socket.on('upgrade', (data) => {
			console.log(data);
		});
	})
}
