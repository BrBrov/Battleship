export default function responseOutput(data: string): void {
	console.log('\x1B[38;2;220;185;20mSend command to client:\x1B[0m');
	console.log(`\x1B[38;2;55;55;250mResponse to clietn ${data}\n\x1B[0m`);
}