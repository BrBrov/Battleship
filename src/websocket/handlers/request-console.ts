import { GeneralDataMessage } from "../../models/request-types";
import { WebSocket } from "ws";

export default function requestOutput(command: GeneralDataMessage, socket: WebSocket): boolean {
  if (!command.hasOwnProperty('type')) {
    console.log('Wrond recived data from socket!');
    const resErr: GeneralDataMessage = {
      type: 'error',
      data: "",
      id: -1
    };
    socket.send(JSON.stringify(resErr));
    return false;
  }

  console.log('Get command from client:');
  console.dir(command.type, '\n');
  console.log(command.data, '\n');

  return true;
}