import * as Mysql from 'mysql';
import { MysqlError } from 'mysql';
import { IUserModel } from './IUserModel';
import { User } from './User';

export class MySqlDataModel implements IUserModel {

	private mDb: Mysql.Connection;

	public constructor() {
		this.mDb = Mysql.createConnection({
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME
		});
	}

	public updateBitcoinByHash(
		hash: string,
		coin: number,
		bitcoin: number,
		callback = (res: UserDbRow) => { }) {

		let query = 'UPDATE user SET coin = ?, bitcoin = ? WHERE hash = ? AND confirm = 1';
		try {
			this.mDb.query(query, [])
		} catch (e) {

		}
	}

	public getBitcoinByHash(hash: string, callback = (res: UserDbRow) => { }) {

		let query = 'SELECT bitcoin FROM user WHERE hash = ? AND confirm = 1'
		try {
			this.mDb.query(query, [hash], (err, rows: UserDbRow[]) => {
				if (err) return;
				callback(rows[0]);
			});

		} catch (e) {

		}
	}

	public async getUsers(): Promise<User[]> {
		let users = await this.getUsersPromise();
		return users;
	}

	public async getUser(hash: string): Promise<User | null> {
		let users = await this.getUsersPromise();
		let user = users.find(user => user.hash === hash);
		return user ? user : null;
	}

	public async rewardCoin(hash: string, reward: number): Promise<boolean> {
		return await this.updateUserCoinPromise(hash, reward);
	}

	private getUsersPromise(): Promise<User[]> {
		let query = 'SELECT * FROM user WHERE confirm = 1';
		return new Promise<User[]>(resolve => {
			this.mDb.query(query, (err, rows: UserDbRow[]) => {
				if (err) return;
				let users = rows.map(row => {
					return {
						hash: row.hash,
						coin: row.coin,
						privateKey: row.private_key
					}
				})
				resolve(users);
			});
		});
	}

	private updateUserCoinPromise(
		hash: string, reward: number): Promise<boolean> {

		let query = 'UPDATE user SET coin = coin + ? '
			+ 'WHERE hash = ? AND confirm = 1';

		return new Promise<boolean>(resolve => {
			let callback = (err: MysqlError, result: MysqlUpdateResult) => {
				if (err || result.affectedRows < 1) {
					resolve(false);
				} else {
					resolve(true);
				}
			};
			this.mDb.query(query, [reward, hash], callback);
		});
	}
}

export type MysqlUpdateCallback =
	(err: MysqlError, result: MysqlUpdateResult) => void;

export type MysqlUpdateResult = {
	fieldCount: number,
	affectedRows: number,
	insertId: number,
	serverStatus: number,
	warningCount: number,
	message: string,
	protocol41: boolean,
	changedRows: number
};

export type UserDbRow = {
	hash: string,
	coin: number,
	private_key: string
};