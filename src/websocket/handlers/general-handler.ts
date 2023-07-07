import { WebSocket } from "ws";
import { GeneralDataMessage } from "../../models/request-types";
import requestOutput from "./request-console";
import TypesOfData from '../../models/command-types';
import { RegData } from "../../models/users-types";

export default function generalHandler(data: string, socket: WebSocket): void {
  const command: GeneralDataMessage = JSON.parse(data);

  if (!requestOutput(command, socket)) return;

  switch (command.type) {
    case TypesOfData.REG:
      const user: GeneralDataMessage = {
        type: "reg",
        data: {
          name: 'qwerty',
          index: 1,
          error: false,
          errorText: 'GOVNO'
        },
        id: 0
      }
      socket.send(JSON.stringify(user));
      socket.send(JSON.stringify({
        type: "update_winners",
        data: [
          {
            name: 'qwerty',
            wins: 10,
          }
        ],
        id: 0
      }));
      break;
    case TypesOfData.CREATE_ROOM:
      socket.send(JSON.stringify({
        type: "update_room",
        data: {
              roomId: 1,
              roomUsers:
                [
                  {
                    name: 'qwerty',
                    index: 0,
                  }
                ],         
        },
        id: 0,
      }));
      break;
  }
}