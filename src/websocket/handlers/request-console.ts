import { GeneralDataMessage } from "../../models/request-types";
import { WebSocket } from "ws";

export default function requestOutput(command: GeneralDataMessage, socket: WebSocket): boolean {
  if (!command.hasOwnProperty('type')) {
    console.log('\x1B[38;2;225;35;20mWrond recived data from socket!\n\x1B[0m');
    const resErr: GeneralDataMessage = {
      type: 'error',
      data: "",
      id: -1
    };
    socket.send(JSON.stringify(resErr));
    return false;
  }

  console.log('\x1B[38;2;10;140;110mGet command from client:\x1B[0m');
  console.log(`\x1B[38;2;190;25;135mGet from client: ${JSON.stringify(command)}\n\x1B[0m`);

  return true;
}