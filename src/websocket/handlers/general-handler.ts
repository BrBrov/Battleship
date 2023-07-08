import { WebSocket } from "ws";
import { GeneralDataMessage } from "../../models/request-types";
import requestOutput from "./request-console";
import responseOutput from './response-console';
import TypesOfData from '../../models/command-types';
import GameController from '../../game/game';
import { User } from '../../models/users-types';
// import { RegData } from "../../models/users-types";

const gameController = new GameController();

export default function generalHandler(data: string, socket: WebSocket): void {
  const command: GeneralDataMessage = JSON.parse(data);

  if (!requestOutput(command, socket)) return;

  switch (command.type) {
    case TypesOfData.REG:

      const requestData: User = JSON.parse(command.data);

      const regMsg: string = gameController.handleReg(requestData);

      responseOutput(regMsg);

      socket.send(regMsg);
      
      const winsMsg: string = gameController.handlerAllWinners();

      responseOutput(winsMsg);
      
      socket.send(winsMsg);

      break;

    case TypesOfData.CREATE_ROOM:
      
      break;
  }
}