import { WebSocket } from 'ws';
import { User, WinnerData } from '../models/users-types';
import UserData from './user-data';
import NamedSocket from './socket-object';

export default class DataBase {
  private allUsers: Array<UserData>

  constructor() {
    this.allUsers = [] as Array<UserData>;
  }

  public setUser(user: User, socket: NamedSocket): UserData {
    const isUser = this.allUsers.find((item: UserData) => item.isUser(user));

    if (isUser) return isUser;

    const index = this.allUsers.length ? this.allUsers.length : 0;

    const newUser = new UserData(user, index, socket);

    this.allUsers.push(newUser);

    return newUser;
  }

  public hasUser(user: User): boolean {
    const result = this.allUsers.find((item: UserData) => item.isUser(user));
    if (result) return true;

    return false;
  }

  public findUser(user: User): UserData {
    return this.allUsers.find((item: UserData) => item.isUser(user));
  }

  public findUserBySocket(socket: WebSocket): UserData {
    return this.allUsers.find((user: UserData) => user.getNamedSocket().getSocket() === socket);
  }

  public getAllWinners(): Array<WinnerData> {
    return this.allUsers.map((item: UserData) => item.getAllWins());
  }

  public checkUserForLogin(user: User): boolean {
    const isUser = this.allUsers.some((item: UserData) => item.checkUserName(user.name));
    
    if (!isUser) return false;

    const isPassword = this.allUsers.some((item: UserData) => item.checkPassword(user.password));

    if (!isPassword) return false;

    return true;
  }
}
