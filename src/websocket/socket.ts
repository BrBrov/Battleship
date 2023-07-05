import { WebSocketServer } from "ws";

export default function createSocket(): void {
	const ws = new WebSocketServer({ port: 3000 });

	ws.on('connection', (socket) => {

		socket.on('message', (socketArg) => {
			console.dir(socketArg.toString());

		});

		socket.on('open', (data) => {
			console.log(typeof data);
			console.log(data);
		});

	})
}
