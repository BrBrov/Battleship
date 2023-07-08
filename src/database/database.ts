import { User, WinnerData } from "../models/users-types";
import UserData from './user-data';

export class DataBase {
  private allUsers: Array<UserData>

  constructor() {
    this.allUsers = [] as Array<UserData>;
  }

  public userHandler(user: User): UserData {
    if (this.isUserExist(user)) {
      return this.getUser(user);      
    }
    
    return this.addUser(user);
  }

  public getAllWinners(): Array<WinnerData> {
    return this.allUsers.map((user: UserData) => user.getAllWins());
  }

  private getUser(user: User): UserData {

    return this.allUsers.find((userData: UserData) => {
      const userRecord = userData.getUserRecord();
      if (userRecord.name === user.name && userRecord.password === user.password) return userData;
    });    
  }

  private addUser(user: User): UserData {
    const index: number = this.allUsers.length ? this.allUsers.length : 0; 
    const newUser: UserData = new UserData(user, index);

    this.allUsers.push(newUser);
    return newUser;
  }

  private isUserExist(user: User): boolean {
    if (this.allUsers.some((item: UserData) => item.getUserRecord().name === user.name && item.getUserRecord().password === user.password)) {
      return true;
    }
    return false;
  }
}

export const database = new DataBase();
