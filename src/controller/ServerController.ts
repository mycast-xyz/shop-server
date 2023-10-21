import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as SocketIO from 'socket.io';

import { Express, Request, Response } from 'express';
import { createServer, Server } from 'http';
import { UserManager } from '../manager/UserManager';
import { IUserModel } from '../models/IUserModel';
import { IServerController } from './IServerController';

export class ServerController implements IServerController {
  private mApp: Express;
  private mServer: Server;
  private mSocket: SocketIO.Server;

  protected mUserModel: IUserModel;

  public constructor(userModel: IUserModel) {
    this.mUserModel = userModel;

    this.mApp = express();

    this.mApp.use(bodyParser.json());
    this.mApp.use(bodyParser.urlencoded({ extended: true }));
    this.mApp.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });

    this.mServer = createServer(this.mApp);

    this.mSocket = SocketIO(this.mServer);
    this.mSocket.on('connection', (socket) => this.onConnect(socket));
  }

  public post(uri: string, handler: (req: Request, res: Response) => void) {
    this.mApp.post(uri, handler);
  }

  public get(uri: string, handler: (req: Request, res: Response) => void) {
    this.mApp.get(uri, handler);
  }

  public start(port: number) {
    this.mServer.listen(port, () => {
      console.log('Server Started.. @' + port);
    });
  }

  public async refreshCurrentCoin(hash: string) {
    let user = await this.mUserModel.getUser(hash);
    this.sendMessage(hash, 'refresh', user.coin);
  }

  public sendMessage(hash: string, tag: string, message: any = null): void {
    const sockets = UserManager.getInstance().getSockets(hash);
    sockets.forEach((socket) => {
      socket.emit(tag, message);
    });
  }

  public sendMessageToAll(tag: string, message: any = null): void {
    const sockets = UserManager.getInstance().getAllSockets();
    sockets.forEach((socket) => {
      socket.emit(tag, message);
    });
  }

  private async onConnect(socket: SocketIO.Socket) {
    const privateKey = socket.handshake.query.key;

    // Abnormal Connection - KeyHash is null
    if (!privateKey) {
      socket.disconnect();
      return;
    }

    let users = await this.mUserModel.getUsers();
    let user = users.find((user) => user.privateKey === privateKey);
    if (user) {
      // Login Success
      socket.on('disconnect', (msg) => this.onDisconnect(socket));
      socket.emit('refresh', user.coin);
      UserManager.getInstance().addSession(user.hash, socket);
    } else {
      // Abnormal Connection - KeyHash is invalid
      socket.disconnect();
    }
  }

  private onDisconnect(socket: SocketIO.Socket): void {
    UserManager.getInstance().removeSession(socket);
  }
}
