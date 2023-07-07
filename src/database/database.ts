import { User } from "../models/users-types";

class DataBase {
  private allUsers: Array<User>

  constructor() {
    this.allUsers = [] as Array<User>;
  }

  getUser(user: User): boolean {
    if (this.isUserExist(user)) {
      return false;
    }

    return true
  }

  public addUser(user: User): boolean {
    if(this.isUserExist(user)) {
      return false;
    }

    this.allUsers.push(user);
    return true;
  }

  private isUserExist(user: User): boolean {
    if (this.allUsers.some((item: User) => item.name === user.name && item.password === user.password)) {
      return true;
    }

    return false;
  }
}

const database = new DataBase();
export default database;