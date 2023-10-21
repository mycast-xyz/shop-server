
export class UserManager {

	private static sInstance: UserManager = null;
	public static getInstance(): UserManager {
		if (this.sInstance === null) {
			this.sInstance = new UserManager();
		}
		return this.sInstance;
	}

	private mSessions: UserSession[] = [];

	public addSession(hash: string, socket: SocketIO.Socket) {
		let duplicatedSession = this.mSessions.find(s => s.hash === hash);
		if (!duplicatedSession) {
			this.mSessions.push({
				hash: hash, sockets: [socket]
			});
		} else {
			if (duplicatedSession.sockets.every(s => s !== socket)) {
				duplicatedSession.sockets.push(socket);
			}
		}
	}

	public removeSession(socket: SocketIO.Socket) {
		this.mSessions = this.mSessions.filter(session => {
			session.sockets = session.sockets.filter(s => s !== socket);
			return session.sockets.length !== 0;
		});
	}

	public getSockets(hash: string): SocketIO.Socket[] {
		const session = this.mSessions.find(s => s.hash === hash);
		if (!session) return [];
		return session.sockets;
	}

	public getAllSockets(): SocketIO.Socket[] {
		let sockets: SocketIO.Socket[] = [];
		this.mSessions.forEach(session => {
			session.sockets.forEach(socket => {
				sockets.push(socket);
			});
		});
		return sockets;
	}

}

export type UserSession = {
	hash: string,
	sockets: SocketIO.Socket[]
}