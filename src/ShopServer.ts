import * as dotenv from 'dotenv';

import { MySqlDataModel } from './models/MySqlDataModel';
import { IUserModel } from './models/IUserModel';
import { BitcoinManager } from './manager/BitcoinManager';
import { ShopServerManager } from './manager/ShopServerManager';
import { IServerController } from './controller/IServerController';

export class ShopServer {
  public static main(): void {
    dotenv.config();

    BitcoinManager.getInstance().init();

    let userModel: IUserModel = new MySqlDataModel();

    let server: IServerController = new ShopServerManager(userModel);
    server.start(9020);
  }
}
