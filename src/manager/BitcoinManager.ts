import * as fs from 'fs';
import { ShopServerManager } from './ShopServerManager';

export class BitcoinManager {

	private static sInstance: BitcoinManager = null;

	private static DEFAULT_PRICE: number = 100;
	private static MINIMUM_RATE: number = -50;
	private static MAXIMUM_RATE: number = 50;

	private mPrice: number;

	public static getInstance(): BitcoinManager {
		if (this.sInstance === null) {
			this.sInstance = new BitcoinManager();
		}
		return this.sInstance;
	}

	private constructor() {

	}

	public init() {
		this.initCache();
		this.initScheduler();
	}

	public getPrice() { return this.mPrice; }

	private initScheduler() {

		let now = new Date().getTime();
		let unit = 1 * 60 * 1000;
		let next = unit - (now % unit);

		setTimeout(() => {
			this.refreshCoinPrice();
			this.initScheduler();
		}, next);
	}

	private refreshCoinPrice() {
		const minimum = BitcoinManager.MINIMUM_RATE;
		const maximum = BitcoinManager.MAXIMUM_RATE;
		let ratePercent = Math.round(
			Math.random() * (maximum - minimum)) + minimum;

		let nextPrice = Math.round(this.mPrice * (100 + ratePercent) / 100);
		this.setBitCoinPrice(nextPrice);
		console.log(`Coin Price refreshed: ${nextPrice}`);
	}

	private setBitCoinPrice(price: number) {
		this.mPrice = price;
		this.saveCache();
	}

	private initCache() {
		if (!fs.existsSync('cache/')) {
			fs.mkdirSync('cache/');
		}
		if (fs.existsSync('cache/bitcoin')) {
			this.loadCache();
		} else {
			this.setBitCoinPrice(BitcoinManager.DEFAULT_PRICE);
		}
	}

	private loadCache() {
		if (!fs.existsSync('cache/')) {
			fs.mkdirSync('cache/');
		}
		if (fs.existsSync('cache/bitcoin')) {
			const data = fs.readFileSync('cache/bitcoin', 'utf-8');
			this.mPrice = parseInt(data);
			console.log(`Cache Load: ${this.mPrice}`);
		}
	}

	private saveCache() {
		if (!fs.existsSync('cache/')) {
			fs.mkdirSync('cache/');
		}
		fs.writeFileSync('cache/bitcoin', `${this.mPrice}`);
	}

}