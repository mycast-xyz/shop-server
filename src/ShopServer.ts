import * as dotenv from 'dotenv';

import { ShopServerManager } from "./Manager/ShopServerManager";
import { BitcoinManager } from "./Manager/BitcoinManager";
import { IServerController } from './Controller/IServerController';
import { MySqlDataModel } from './models/MySqlDataModel';
import { IUserModel } from './models/IUserModel';

export class ShopServer {

	public static main(): void {

		dotenv.config();

		BitcoinManager.getInstance().init();

		let userModel: IUserModel = new MySqlDataModel();

		let server: IServerController = new ShopServerManager(
			userModel
		);
		server.start(9020);
	}

}